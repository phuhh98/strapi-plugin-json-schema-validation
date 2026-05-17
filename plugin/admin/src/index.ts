import { getTranslation } from './utils/getTranslation';
import {
  JSON_SCHEMA_FIELD_OPTIONS_KEY,
  PLUGIN_CUSTOM_JSON_FIELD_NAME,
  PLUGIN_ID,
} from '../../shared/constants/plugin';
import { Initializer } from './components/Initializer';
import { PluginIcon } from './components/PluginIcon';
import { prefixPluginTranslations } from './utils/prefixPluginTranslation';
import { useFetchClient, type StrapiApp } from '@strapi/strapi/admin';
import { Braces } from 'lucide-react';

import * as yup from 'yup';
import { Schema } from 'jsonschema';
import jsonSchemaValidator from './utils/preloadedJsonSchema';

import DRAFT_2020_12_SCHEMA from '../../shared/schemas/DRAFT-2020-12/schema';

export default {
  register(app: StrapiApp) {
    app.customFields.register({
      name: PLUGIN_CUSTOM_JSON_FIELD_NAME,
      pluginId: PLUGIN_ID,
      type: 'json',
      icon: Braces,
      intlLabel: {
        id: getTranslation('field.label'),
        defaultMessage: 'JSON Schema Validation',
      },
      intlDescription: {
        id: getTranslation('field.description'),
        defaultMessage: 'Enter a JSON Schema to validate the content of this field.',
      },
      components: {
        Input: async () =>
          import('./components/JSONSchemaValidationInput').then((module) => ({
            default: module.default,
          })),
      },
      options: {
        base: [
          {
            sectionTitle: null,
            items: [
              {
                name: `options.${JSON_SCHEMA_FIELD_OPTIONS_KEY.base.jsonSchema}`,
                type: 'json',
                intlLabel: {
                  id: getTranslation('options.base.jsonSchema.label'),
                  defaultMessage: 'JSON Schema',
                },
                description: {
                  id: getTranslation('options.base.jsonSchema.description'),
                  defaultMessage: 'Follow JSON schema DRAFT 2020-12 specification.',
                },
                defaultValue: '{}',
              },
            ],
          },
        ],

        validator: () => ({
          [JSON_SCHEMA_FIELD_OPTIONS_KEY.base.jsonSchema]: yup
            .string()
            .required('JSON Schema is required')
            .test('is-valid-json', 'Invalid JSON', function (value) {
              if (!value) return true; // handled by required rule
              try {
                JSON.parse(value);
                return true;
              } catch (err) {
                return false;
              }
            })
            .test(
              'is-valid-json-schema',
              'The JSON Schema must follow the DRAFT 2020-12 specification',
              function (value) {
                if (!value) return true;

                let parsedData = '';

                try {
                  parsedData = JSON.parse(value);
                } catch (err: any) {
                  return this.createError({ message: `Invalid JSON format: ${err.message}` });
                }

                try {
                  const metaValidationResult = jsonSchemaValidator.validate(
                    parsedData,
                    DRAFT_2020_12_SCHEMA as Schema
                  );

                  const { valid, errors } = metaValidationResult;
                  if (!valid) {
                    return this.createError({
                      message: `Invalid JSON Schema: ${errors?.map((e) => e.stack).join(', ')}`,
                    });
                  }
                  return true;
                } catch (err: any) {
                  return this.createError({
                    message: `Error during JSON Schema validation: ${err.message}`,
                  });
                }
              }
            ),
        }),
      },
    });
  },

  async registerTrads({ locales }: { locales: string[] }) {
    return Promise.all(
      locales.map(async (locale) => {
        try {
          const { default: data } = await import(`./translations/${locale}.json`);

          return {
            data: {
              ...prefixPluginTranslations(data, PLUGIN_ID),
            },
            locale,
          };
        } catch {
          return { data: {}, locale };
        }
      })
    );
  },
};

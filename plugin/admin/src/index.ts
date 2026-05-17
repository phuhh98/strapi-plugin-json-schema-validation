import { type StrapiApp, useFetchClient } from '@strapi/strapi/admin';
import { Schema } from 'jsonschema';
import { Braces } from 'lucide-react';
import * as yup from 'yup';

import {
  JSON_SCHEMA_FIELD_OPTIONS_KEY,
  PLUGIN_CUSTOM_JSON_FIELD_NAME,
  PLUGIN_ID,
} from '../../shared/constants/plugin';
import DRAFT_2020_12_SCHEMA from '../../shared/schemas/DRAFT-2020-12/schema';
import { Initializer } from './components/Initializer';
import { PluginIcon } from './components/PluginIcon';
import { getTranslation } from './utils/getTranslation';
import { prefixPluginTranslations } from './utils/prefixPluginTranslation';
import jsonSchemaValidator from './utils/preloadedJsonSchema';

export default {
  register(app: StrapiApp) {
    app.customFields.register({
      components: {
        Input: async () =>
          import('./components/JSONSchemaValidationInput').then((module) => ({
            default: module.default,
          })),
      },
      icon: Braces,
      intlDescription: {
        defaultMessage: 'Enter a JSON Schema to validate the content of this field.',
        id: getTranslation('field.description'),
      },
      intlLabel: {
        defaultMessage: 'JSON Schema Validation',
        id: getTranslation('field.label'),
      },
      name: PLUGIN_CUSTOM_JSON_FIELD_NAME,
      options: {
        base: [
          {
            items: [
              {
                description: {
                  defaultMessage: 'Follow JSON schema DRAFT 2020-12 specification.',
                  id: getTranslation('options.base.jsonSchema.description'),
                },
                intlLabel: {
                  defaultMessage: 'JSON Schema',
                  id: getTranslation('options.base.jsonSchema.label'),
                },
                name: `options.${JSON_SCHEMA_FIELD_OPTIONS_KEY.base.jsonSchema}`,
                type: 'json',
              },
            ],
            sectionTitle: null,
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
              } catch (_err) {
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

                  const { errors, valid } = metaValidationResult;
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
      pluginId: PLUGIN_ID,
      type: 'json',
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

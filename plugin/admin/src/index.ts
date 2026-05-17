import { getTranslation } from './utils/getTranslation';
import {
  JSON_SCHEMA_FIELD_OPTIONS_KEY,
  PLUGIN_CUSTOM_JSON_FIELD_NAME,
  PLUGIN_ID,
} from '../../shared/constants/plugin';
import { Initializer } from './components/Initializer';
import { PluginIcon } from './components/PluginIcon';
import { prefixPluginTranslations } from './utils/prefixPluginTranslation';
import type { StrapiApp } from '@strapi/strapi/admin';
import { Braces } from 'lucide-react';

import * as yup from 'yup';

const worker = new Worker(new URL('./utils/validator.worker.js', import.meta.url));

// Send a dynamic schema to the worker at runtime
worker.postMessage({ schema: userGeneratedSchema });

worker.onmessage = (event) => {
  const { isValid, errors } = event.data;
  if (!isValid) {
    console.log('Dynamic schema is invalid:', errors);
  } else {
    console.log('Dynamic schema is completely valid!');
  }
};

const isSchemaValid = (schema: string) => {
  try {
    const parsedSchema = JSON.parse(schema);
    console.log('Parsed Schema:', parsedSchema);
    const result = ajv.validateSchema(parsedSchema);
    console.log('Schema Validation Result:', result);
    return {
      isValid: result,
      errors: ajv.errors,
    };
  } catch (err) {
    console.error('Invalid Schema:', err);
    return {
      isValid: false,
      errors: [{ message: 'Invalid Schema' }],
    };
  }
};

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
            .test('is-valid-json', 'Invalid JSON', (value) => {
              console.log('Validating JSON Schema:', value);
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
              (value) => {
                if (!value) return true;
                const { isValid, errors } = isSchemaValid(value);
                if (!isValid) {
                  console.error('Invalid Schema:', errors);
                  return false;
                }
                return true;
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

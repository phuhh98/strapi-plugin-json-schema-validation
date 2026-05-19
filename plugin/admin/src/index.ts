import { type StrapiApp } from '@strapi/strapi/admin';
import { Schema } from 'jsonschema';
import { Braces } from 'lucide-react';
import * as yup from 'yup';

import {
  JSON_SCHEMA_FIELD_OPTIONS_KEY,
  PLUGIN_CUSTOM_JSON_FIELD_NAME,
  PLUGIN_ID,
} from '../../shared/constants/plugin';
import DRAFT_2020_12_SCHEMA from '../../shared/schemas/DRAFT-2020-12/schema';
import { getTranslationKey } from './utils/getTranslationKey';
import { prefixPluginTranslations } from './utils/prefixPluginTranslation';
import jsonSchemaValidator from './utils/preloadedJsonSchema';
import { THEME } from './utils/themeConstant';

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
        id: getTranslationKey('field.description'),
      },
      intlLabel: {
        defaultMessage: 'JSON Schema Validation',
        id: getTranslationKey('field.label'),
      },
      name: PLUGIN_CUSTOM_JSON_FIELD_NAME,
      options: {
        base: [
          {
            items: [
              {
                description: {
                  defaultMessage: 'Follow JSON schema DRAFT 2020-12 specification.',
                  id: getTranslationKey('options.base.jsonSchema.description'),
                },
                intlLabel: {
                  defaultMessage: 'JSON Schema',
                  id: getTranslationKey('options.base.jsonSchema.label'),
                },
                // @ts-expect-error: types from strapi is not 100% correct with custom fields
                name: `options.${JSON_SCHEMA_FIELD_OPTIONS_KEY.base.jsonSchema}`,
                // @ts-expect-error: 'json' is correct here https://docs.strapi.io/cms/features/custom-fields#registering-a-custom-field-in-the-admin-panel
                type: 'json',
              },
              {
                description: {
                  id: getTranslationKey('options.base.theme.description'),
                  defaultMessage: 'Select the theme for the JSON editor in the content manager.',
                },
                intlLabel: {
                  id: getTranslationKey('options.base.theme.label'),
                  defaultMessage: 'JSON Editor Theme',
                },
                // @ts-expect-error: types from strapi is not 100% correct with custom fields
                name: `options.${JSON_SCHEMA_FIELD_OPTIONS_KEY.base.theme}`,
                type: 'select',
                value: THEME.VS_DARK,
                options: [
                  {
                    key: THEME.VS_DARK,
                    defaultValue: true,
                    value: THEME.VS_DARK,
                    metadatas: {
                      intlLabel: {
                        id: getTranslationKey('options.base.theme.vs_dark.label'),
                        defaultMessage: 'VS-Dark',
                      },
                    },
                  },
                  {
                    key: THEME.LIGHT,
                    value: THEME.LIGHT,
                    metadatas: {
                      intlLabel: {
                        id: getTranslationKey('options.base.theme.light.label'),
                        defaultMessage: 'Light',
                      },
                    },
                  },
                  {
                    key: THEME.GITHUB,
                    value: THEME.GITHUB,
                    metadatas: {
                      intlLabel: {
                        id: getTranslationKey('options.base.theme.github.label'),
                        defaultMessage: 'GitHub',
                      },
                    },
                  },
                  {
                    key: THEME.GITHUB_LIGHT,
                    value: THEME.GITHUB_LIGHT,
                    metadatas: {
                      intlLabel: {
                        id: getTranslationKey('options.base.theme.github_light.label'),
                        defaultMessage: 'GitHub Light',
                      },
                    },
                  },
                  {
                    key: THEME.GITHUB_DARK,
                    value: THEME.GITHUB_DARK,
                    metadatas: {
                      intlLabel: {
                        id: getTranslationKey('options.base.theme.github_dark.label'),
                        defaultMessage: 'GitHub Dark',
                      },
                    },
                  },
                  {
                    key: THEME.MONOKAI,
                    value: THEME.MONOKAI,
                    metadatas: {
                      intlLabel: {
                        id: getTranslationKey('options.base.theme.monokai.label'),
                        defaultMessage: 'Monokai',
                      },
                    },
                  },
                  {
                    key: THEME.XCODE,
                    value: THEME.XCODE,
                    metadatas: {
                      intlLabel: {
                        id: getTranslationKey('options.base.theme.xcode.label'),
                        defaultMessage: 'XCode',
                      },
                    },
                  },
                ],
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
          [JSON_SCHEMA_FIELD_OPTIONS_KEY.base.theme]: yup.string().required(),
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

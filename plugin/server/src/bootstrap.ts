import type { Core } from '@strapi/strapi';

import { errors } from '@strapi/utils';

import { PLUGIN_CUSTOM_JSON_FIELD_NAME, PLUGIN_ID } from '../../shared/constants/plugin';
import { ServiceName, Services } from './services';
import { getServiceName } from './utils/names';

const bootstrap = ({ strapi }: { strapi: Core.Strapi }) => {
  strapi.db.lifecycles.subscribe({
    async beforeCreate(event) {
      await handleGlobalValidation(event, strapi);
    },
    async beforeUpdate(event) {
      await handleGlobalValidation(event, strapi);
    },
  });
};

async function handleGlobalValidation(event, strapi: Core.Strapi) {
  const { model, params } = event;
  if (!params.data) return;
  const validationService = strapi
    .plugin(PLUGIN_ID)
    .service<Services[typeof ServiceName.Validation]>(getServiceName(ServiceName.Validation));

  const walkAndValidate = (schemaAttributes, currentData, currentUid) => {
    if (!currentData || typeof currentData !== 'object') return;
    for (const fieldName of Object.keys(currentData)) {
      const attribute = schemaAttributes[fieldName];
      if (!attribute) continue;
      if (attribute.customField === `plugin::${PLUGIN_ID}.${PLUGIN_CUSTOM_JSON_FIELD_NAME}`) {
        const result = validationService.validateFieldData(
          currentUid,
          fieldName,
          currentData[fieldName]
        );

        if (result.isValid === false) {
          throw new errors.ValidationError(
            `Validation failed for field "${fieldName}": ${result.errorString || 'Invalid data'}`,
            {
              errors: [
                {
                  message: result.errorString || '',
                  name: 'ValidationError',
                  path: [fieldName],
                },
              ],
            }
          );
        }
      }
      // TODO: verify this case for component and dynamic zones
      else if (attribute.type === 'component') {
        const componentSchema = strapi.components[attribute.component];
        if (!componentSchema) continue;
        if (attribute.repeatable && Array.isArray(currentData[fieldName])) {
          currentData[fieldName].forEach((item) => {
            walkAndValidate(componentSchema.attributes, item, currentUid);
          });
        } else {
          walkAndValidate(componentSchema.attributes, currentData[fieldName], currentUid);
        }
      } else if (attribute.type === 'dynamiczone' && Array.isArray(currentData[fieldName])) {
        currentData[fieldName].forEach((dzItem) => {
          const componentSchema = strapi.components[dzItem.__component];
          if (componentSchema) {
            walkAndValidate(componentSchema.attributes, dzItem, currentUid);
          }
        });
      }
    }
  };
  walkAndValidate(model.attributes, params.data, model.uid);
}

export default bootstrap;

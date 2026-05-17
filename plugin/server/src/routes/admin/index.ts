import { Core } from '@strapi/strapi';
import { getHandlerName } from '../../utils/names';

export default () => ({
  routes: [
    {
      method: 'POST',
      path: '/validateSchemaStructure',
      handler: getHandlerName('validation.validateSchemaStructure'),
    },
    {
      method: 'POST',
      path: '/validateSchema',
      handler: getHandlerName('validation.validateSchema'),
    },
  ] satisfies Partial<Core.Route>[],
  type: 'admin',
});

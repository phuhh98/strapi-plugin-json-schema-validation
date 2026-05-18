import { Core } from '@strapi/strapi';

import { getHandlerName } from '../../utils/names';

export default () => ({
  routes: [
    {
      handler: getHandlerName('validation.validateSchemaStructure'),
      method: 'POST',
      path: '/validateSchemaStructure',
    },
    {
      handler: getHandlerName('validation.validateSchema'),
      method: 'POST',
      path: '/validateSchema',
    },
  ] satisfies Partial<Core.Route>[],
  type: 'admin',
});

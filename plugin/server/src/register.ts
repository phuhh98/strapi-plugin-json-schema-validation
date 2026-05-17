import type { Core } from '@strapi/strapi';

import { PLUGIN_CUSTOM_JSON_FIELD_NAME, PLUGIN_ID } from '../../shared/constants/plugin';

const register = ({ strapi }: { strapi: Core.Strapi }) => {
  // register phase
  strapi.customFields.register({
    inputSize: {
      default: 12,
      isResizable: true,
    },
    name: PLUGIN_CUSTOM_JSON_FIELD_NAME,
    plugin: PLUGIN_ID,
    type: 'json',
  });
};

export default register;

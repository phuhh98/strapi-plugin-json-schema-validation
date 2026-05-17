import type { Core } from '@strapi/strapi';
import { PLUGIN_ID } from '../../../shared/constants/plugin';

const controller = ({ strapi }: { strapi: Core.Strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin(PLUGIN_ID)
      // the name of the service file & the method.
      .service('service')
      .getWelcomeMessage();
  },

  // async validateSchemaStructure(ctx) {
  //   const { jsonSchema } = ctx.request.body;
  //   const result = strapi.plugin(PLUGIN_ID).service('service').validateJSONSchema(jsonSchema);
  //   ctx.body = { data: result };
  // },
});

export default controller;

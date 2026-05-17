import type { Core } from '@strapi/strapi';

import { PLUGIN_ID } from '../../../shared/constants/plugin';
import { ValidationService } from '../services/validation';
import { getServiceName } from '../utils/names';

const validation = ({ strapi }: { strapi: Core.Strapi }) => ({
  async validateSchemaStructure(ctx) {
    const { schema } = ctx.request.body;
    const validationService = strapi
      .plugin(PLUGIN_ID)
      .service<ValidationService>(getServiceName('validation'));
    const result = validationService.validateSchemaStructure(schema);
    ctx.body = { data: result };
  },

  async validateSchema(ctx) {
    const { schema, data } = ctx.request.body;
    const validationService = strapi
      .plugin(PLUGIN_ID)
      .service<ValidationService>(getServiceName('validation'));
    const result = validationService.validateSchema(schema, data);
    ctx.body = { data: result };
  },
});

export type ValidationController = ReturnType<typeof validation>;
export type ValidationControllerMethod = keyof ValidationController;

export default validation;

import type { Core } from '@strapi/strapi';

import ajv from '../utils/ajv';

const service = ({ strapi: _strapi }: { strapi: Core.Strapi }) => ({
  getWelcomeMessage() {
    return 'Welcome to Strapi 🚀';
  },

  validateJSONSchema(jsonSchema: string) {
    try {
      const parsedSchema = JSON.parse(jsonSchema);
      const isValid = ajv.validateSchema(parsedSchema);
      return {
        errors: ajv.errors,
        isValid,
      };
    } catch (err) {
      console.error('Invalid JSON Schema:', err);
      return { error: 'Invalid JSON Schema', isValid: false };
    }
  },
});

export default service;

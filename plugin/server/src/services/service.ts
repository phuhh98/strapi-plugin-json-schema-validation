import type { Core } from '@strapi/strapi';
import ajv from '../utils/ajv';

const service = ({ strapi }: { strapi: Core.Strapi }) => ({
  getWelcomeMessage() {
    return 'Welcome to Strapi 🚀';
  },

  validateJSONSchema(jsonSchema: string) {
    try {
      const parsedSchema = JSON.parse(jsonSchema);
      const isValid = ajv.validateSchema(parsedSchema);
      return {
        isValid,
        errors: ajv.errors,
      };
    } catch (err) {
      console.error('Invalid JSON Schema:', err);
      return { isValid: false, error: 'Invalid JSON Schema' };
    }
  },
});

export default service;

import type { Core } from '@strapi/strapi';

import ajv from '../utils/ajv';

const validation = ({ strapi: _strapi }: { strapi: Core.Strapi }) => ({
  /**
   * This service method validates the structure of a JSON Schema using AJV against DRAFT-2020-12 specs
   * @param jsonSchema - The JSON Schema string to validate
   * @returns
   */
  validateSchemaStructure(jsonSchema: string) {
    try {
      const parsedSchema = JSON.parse(jsonSchema);
      const isValid = ajv.validateSchema(parsedSchema);
      return {
        errors: ajv.errors,
        isValid,
      };
    } catch (err) {
      console.error('Error while validating JSON Schema structure:', err);
      return { processingError: 'Error while validating JSON Schema structure', isValid: false };
    }
  },

  validateSchema(schema: object, data: object) {
    try {
      const validate = ajv.compile(schema);

      const valid = validate(data);
      return {
        errors: validate.errors,
        isValid: valid,
      };
    } catch (err) {
      console.error('Error while validating JSON Schema:', err);
      return { processingError: `Error while validating JSON Schema: ${err}`, isValid: false };
    }
  },
});

export type ValidationService = ReturnType<typeof validation>;
export type ValidationServiceMethod = keyof ValidationService;

export default validation;

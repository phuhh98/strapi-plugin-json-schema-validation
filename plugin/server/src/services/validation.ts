import type { Core } from '@strapi/strapi';

import ajv from '../utils/ajv';

const validation = ({ strapi: _strapi }: { strapi: Core.Strapi }) => ({
  validateSchema(schema: object, data: object) {
    try {
      const validate = ajv.compile(schema);

      const valid = validate(data);
      return {
        errors: validate.errors,
        isValid: valid,
      };
    } catch (err) {
      return { isValid: false, processingError: `Error while validating JSON Schema: ${err}` };
    }
  },

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
    } catch (_err) {
      return { isValid: false, processingError: 'Error while validating JSON Schema structure' };
    }
  },
});

export type ValidationService = ReturnType<typeof validation>;
export type ValidationServiceMethod = keyof ValidationService;

export default validation;

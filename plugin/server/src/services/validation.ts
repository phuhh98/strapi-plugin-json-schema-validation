import type { Core } from '@strapi/strapi';
import type { ErrorObject } from 'ajv';
// Helper to map AJV errors to our error format
function mapAjvErrors(errors: ErrorObject[] | null | undefined): ValidationResult['errors'] {
  return (
    errors?.map((err) => {
      const path = err.instancePath.startsWith('/')
        ? err.instancePath.slice(1).replace(/\//g, '.')
        : err.instancePath.replace(/\//g, '.');

      return {
        keyword: err.keyword,
        message: err.message,
        params: err.params,
        path: path || 'root',
      };
    }) || []
  );
}

import { FieldAttribute, JSONValidationFieldOptions } from '../../../shared/types/field';
import { ValidationResult } from '../../../shared/types/validation';
import ajv from '../utils/ajv';

const validation = ({ strapi }: { strapi: Core.Strapi }) => ({
  /**
   * Validate a field's data using its schema from the content type, or an ad-hoc schema.
   * Throws a Strapi validation error if invalid.
   * @param uid Content type UID
   * @param fieldName Field name
   * @param value Value to validate
   * @param customSchema Optional ad-hoc schema
   */
  validateFieldData(
    uid: null | string,
    fieldName: null | string,
    value: any,
    customSchema: null | object = null
  ): ValidationResult {
    let targetSchema = customSchema;

    let fieldAttributes: FieldAttribute<JSONValidationFieldOptions> | undefined = undefined;

    if (!targetSchema && uid && fieldName) {
      const contentType = strapi.contentType(uid as unknown as any);

      if (!contentType) throw new Error(`Content type ${uid} not found.`);

      fieldAttributes = contentType.attributes[fieldName] as
        | FieldAttribute<JSONValidationFieldOptions>
        | undefined;

      if (!fieldAttributes) throw new Error(`Field ${fieldName} not found on ${uid}.`);

      targetSchema = JSON.parse(fieldAttributes.options?.jsonSchema || '{}');
    }

    if (
      fieldAttributes?.options.required &&
      (value === undefined || value === null || value === '')
    ) {
      return {
        errors: [
          {
            keyword: 'required',
            message: 'This field is required',
            params: {},
            path: fieldName,
          },
        ],
        isValid: false,
      };
    }

    if (
      fieldAttributes?.options.required === false &&
      (value === undefined || value === null || value === '')
    ) {
      return {
        errors: null,
        isValid: true,
      };
    }

    if (!targetSchema) {
      return {
        errors: [
          {
            keyword: 'schema_not_found',
            message: 'No JSON Schema found for validation',
            params: {},
            path: fieldName,
          },
        ],
        isValid: false,
      };
    }

    const parsedValue = typeof value === 'string' ? JSON.parse(value) : value;
    const result = validation({ strapi }).validateSchema(targetSchema, parsedValue);

    if (!result.isValid) {
      return result;
    }

    return { errors: null, isValid: true };
  },

  validateSchema(schema: object, data: object): ValidationResult {
    try {
      const validate = ajv.compile(schema);
      const valid = validate(data);

      const mappedErrors = mapAjvErrors(validate.errors);

      return {
        errors: mappedErrors,
        errorString: mappedErrors.map((e) => `${e.path} ${e.message}`).join(', '),
        isValid: valid,
      };
    } catch (err) {
      return {
        errors: null,
        isValid: false,
        processingError: `Error while validating JSON Schema: ${err}`,
      };
    }
  },

  /**
   * This service method validates the structure of a JSON Schema using AJV against DRAFT-2020-12 specs
   * @param jsonSchema - The JSON Schema string to validate
   * @returns
   */
  async validateSchemaStructure(jsonSchema: string): Promise<ValidationResult> {
    try {
      const parsedSchema = JSON.parse(jsonSchema);
      const isValid = await ajv.validateSchema(parsedSchema);
      return {
        errors: mapAjvErrors(ajv.errors),
        errorString: ajv.errors?.map((e) => `${e.instancePath} ${e.message}`).join(', '),
        isValid: Boolean(isValid),
      };
    } catch (err) {
      console.error('Error while validating JSON Schema structure', err);
      return {
        errors: null,
        isValid: false,
        processingError: `Error while validating JSON Schema structure: ${err}`,
      };
    }
  },
});

export type ValidationService = ReturnType<typeof validation>;
export type ValidationServiceMethod = keyof ValidationService;

export default validation;

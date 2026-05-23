export interface FieldAttribute<TOptions = unknown> {
  /**
   * Name of the custom field with plugin prefix, for example 'plugin::strapi-plugin-json-schema-validation.json-schema-validation'
   */
  customField: string;
  options: TOptions;
  /**
   * Existing Strapi data type the custom field will use
   * 'text', 'date', 'number', 'json', etc...
   */
  type: string;
}

export interface JSONValidationFieldOptions {
  jsonSchema: string;
  required?: boolean;
  theme: string;
}

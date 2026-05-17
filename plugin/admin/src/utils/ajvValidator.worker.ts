import Ajv2020 from 'ajv/dist/2020';
import addFormats from 'ajv-formats';

const ajv = new Ajv2020();
addFormats(ajv);

self.onmessage = (event) => {
  const { schema } = event.data;
  // Validate the dynamic schema structure at runtime
  const isValid = ajv.validateSchema(schema);

  self.postMessage({
    isValid,
    errors: ajv.errors,
  });
};

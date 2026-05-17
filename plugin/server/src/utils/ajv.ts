import Ajv2020 from 'ajv/dist/2020';
import addFormats from 'ajv-formats';

const ajv = new Ajv2020();
addFormats(ajv);

export default ajv;

import addFormats from 'ajv-formats';
import Ajv2020 from 'ajv/dist/2020';

const ajv = new Ajv2020();
addFormats(ajv);

export default ajv;

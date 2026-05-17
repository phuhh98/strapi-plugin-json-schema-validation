/**
 * Preload Json Schema with DRAFT 2020-12 schema and meta-schema
 * This validation using jsonschema is opt in just for yup options validation
 * since yup require to work synchronously, and ajv is not working on FE with content security policy
 * that block unsafe-eval, which is required by ajv to compile the schema with new Function().
 *
 * We would use ajv as a service on server side to validate schema structure on record creation
 */

import { Schema, Validator } from 'jsonschema';
import metaCore from '../../../shared/schemas/DRAFT-2020-12/metaCore';
import metaApplication from '../../../shared/schemas/DRAFT-2020-12/metaApplication';
import metaValidation from '../../../shared/schemas/DRAFT-2020-12/metaValidation';
import metaContent from '../../../shared/schemas/DRAFT-2020-12/metaContent';
import metaFormatAnnotation from '../../../shared/schemas/DRAFT-2020-12/metaFormatAnnotation';
import metaMetaData from '../../../shared/schemas/DRAFT-2020-12/metaMetaData';
import metaUnevaluated from '../../../shared/schemas/DRAFT-2020-12/metaUnevaluated';

const v = new Validator();
v.addSchema(metaCore as Schema);
v.addSchema(metaApplication as Schema);
v.addSchema(metaValidation as unknown as Schema);
v.addSchema(metaContent as Schema);
v.addSchema(metaFormatAnnotation as Schema);
v.addSchema(metaMetaData as unknown as Schema);
v.addSchema(metaUnevaluated as Schema);

export default v;

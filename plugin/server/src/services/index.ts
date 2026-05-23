import validation, { ValidationService } from './validation';

export enum ServiceName {
  Validation = 'validation',
}

export type Services = {
  [ServiceName.Validation]: ValidationService;
};

export default {
  [ServiceName.Validation]: validation,
};

import service, { Service } from './service';
import validation, { ValidationService } from './validation';

export enum ServiceName {
  Service = 'service',
  Validation = 'validation',
}

export type Services = {
  [ServiceName.Service]: Service;
  [ServiceName.Validation]: ValidationService;
};

export default {
  [ServiceName.Service]: service,
  [ServiceName.Validation]: validation,
};

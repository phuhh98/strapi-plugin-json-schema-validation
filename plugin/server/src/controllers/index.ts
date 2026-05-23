import validation, { ValidationController, ValidationControllerMethod } from './validation';

export enum ControllerName {
  Validation = 'validation',
}

export type Controllers = {
  [ControllerName.Validation]: ValidationController;
};

export type HandlerName = `${ControllerName.Validation}.${ValidationControllerMethod}`;

export default {
  [ControllerName.Validation]: validation,
};

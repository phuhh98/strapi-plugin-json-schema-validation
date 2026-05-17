import controller, { Controller, ControllerMethod } from './controller';
import validation, { ValidationController, ValidationControllerMethod } from './validation';

export enum ControllerName {
  Controller = 'controller',
  Validation = 'validation',
}

export type Controllers = {
  [ControllerName.Controller]: Controller;
  [ControllerName.Validation]: ValidationController;
};

export type HandlerName =
  | `${ControllerName.Controller}.${ControllerMethod}`
  | `${ControllerName.Validation}.${ValidationControllerMethod}`;

export default {
  [ControllerName.Controller]: controller,
  [ControllerName.Validation]: validation,
};

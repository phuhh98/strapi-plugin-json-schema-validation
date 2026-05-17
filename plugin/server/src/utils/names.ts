import { HandlerName } from '../controllers';
import { ServiceName } from '../services';

export const getHandlerName = (handler: HandlerName) => {
  return handler;
};

export const getServiceName = (service: `${ServiceName}`) => {
  return service;
};

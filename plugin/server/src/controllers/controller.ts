import type { Core } from '@strapi/strapi';

import { PLUGIN_ID } from '../../../shared/constants/plugin';
import { Service } from '../services/service';
import { getServiceName } from '../utils/names';

const controller = ({ strapi }: { strapi: Core.Strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin(PLUGIN_ID)
      // the name of the service file & the method.
      .service<Service>(getServiceName('service'))
      .getWelcomeMessage();
  },
});

export type Controller = ReturnType<typeof controller>;
export type ControllerMethod = keyof Controller;

export default controller;

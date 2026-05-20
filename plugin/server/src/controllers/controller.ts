import type { Core } from '@strapi/strapi';

import { PLUGIN_ID } from '../../../shared/constants/plugin';
import { Services } from '../services';
import { getServiceName } from '../utils/names';

const controller = ({ strapi }: { strapi: Core.Strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin(PLUGIN_ID)
      // the name of the service file & the method.
      .service<Services['service']>(getServiceName('service'))
      .getWelcomeMessage();
  },
});

export type Controller = ReturnType<typeof controller>;
export type ControllerMethod = keyof Controller;

export default controller;

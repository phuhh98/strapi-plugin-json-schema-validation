import type { Core } from '@strapi/strapi';

import { PLUGIN_ID } from '../../../shared/constants/plugin';
import { getServiceName } from '../utils/names';
import { Services } from '../services';

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

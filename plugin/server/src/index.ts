import type { Services as ServicesAlias } from './services';

/**
 * Application methods
 */
import bootstrap from './bootstrap';
/**
 * Plugin server methods
 */
import config from './config';
import contentTypes from './content-types';
import controllers from './controllers';
import destroy from './destroy';
import middlewares from './middlewares';
import policies from './policies';
import register from './register';
import routes from './routes';
import services from './services';
import { getServiceName as getServiceNameAlias } from './utils/names';

export default {
  bootstrap,
  config,
  contentTypes,
  controllers,
  destroy,
  middlewares,
  policies,
  register,
  routes,
  services,
};

/**
 * Control the expose layer of the plugin server controllers for downstream usage.
 */
export namespace PluginServer {
  export namespace Services {
    export type Services = ServicesAlias;
    export const getServiceName = getServiceNameAlias;
  }
}

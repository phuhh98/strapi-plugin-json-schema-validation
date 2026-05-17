import { getHandlerName } from '../../utils/names';

export default () => ({
  routes: [
    {
      config: {
        policies: [],
      },
      // name of the controller file & the method.
      handler: getHandlerName('controller.index'),
      method: 'GET',
      path: '/',
    },
  ],
  type: 'content-api',
});

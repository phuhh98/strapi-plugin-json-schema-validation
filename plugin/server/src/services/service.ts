import type { Core } from '@strapi/strapi';

import ajv from '../utils/ajv';

const service = ({ strapi: _strapi }: { strapi: Core.Strapi }) => ({
  getWelcomeMessage() {
    return 'Welcome to Strapi 🚀';
  },
});

export type Service = ReturnType<typeof service>;
export type ServiceMethod = keyof Service;

export default service;

import { Page } from '@strapi/strapi/admin';
import { Route, Routes } from 'react-router-dom';

import { HomePage } from './HomePage';

const App = () => {
  return (
    <Routes>
      <Route element={<HomePage />} index />
      <Route element={<Page.Error />} path="*" />
    </Routes>
  );
};

export { App };

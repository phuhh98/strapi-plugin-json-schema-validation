import { Main } from '@strapi/design-system';
import { useIntl } from 'react-intl';

import { getTranslationKey } from '../utils/getTranslationKey';

const HomePage = () => {
  const { formatMessage } = useIntl();

  return (
    <Main>
      <h1>Welcome to {formatMessage({ id: getTranslationKey('name') })}</h1>
      <p>{formatMessage({ id: getTranslationKey('description') })}</p>
    </Main>
  );
};

export { HomePage };

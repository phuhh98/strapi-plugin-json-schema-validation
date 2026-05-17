import { PLUGIN_ID } from '../../../shared/constants/plugin';
import { TranslationKey } from '../translations/types';

const getTranslation = (id: TranslationKey) => `${PLUGIN_ID}.${id}`;

export { getTranslation };

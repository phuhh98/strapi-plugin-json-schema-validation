import { PLUGIN_ID } from '../../../shared/constants/plugin';
import { TranslationKey } from '../translations/types';

const getTranslationKey = (id: TranslationKey) => `${PLUGIN_ID}.${id}`;

export { getTranslationKey };

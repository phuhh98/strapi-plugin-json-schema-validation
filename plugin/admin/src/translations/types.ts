/**
 * en.json is basis for the translation types
 * We import it as a module to extract the types from it
 */
import en from './en.json' with { type: 'json' };

export type Translation = typeof en;
export type TranslationKey = keyof Translation;

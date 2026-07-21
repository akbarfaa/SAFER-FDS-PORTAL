/**
 * i18n Feature — Types & Interfaces
 */

export type Language = 'id' | 'en';
export type Translations = Record<string, string>;
export type Dictionary = Record<Language, Translations>;

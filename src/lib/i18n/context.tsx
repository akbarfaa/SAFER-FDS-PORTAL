/**
 * i18n Feature — React Context & Custom Hook
 */
import { useSyncExternalStore } from "react";
import type { Language, Dictionary } from "./types";
import { idTranslations } from "./translations/id";
import { enTranslations } from "./translations/en";

const dictionary: Dictionary = {
  id: idTranslations,
  en: enTranslations,
};

let currentLanguage: Language = 'id';
const listeners = new Set<() => void>();

export const languageStore = {
  getLanguage: () => currentLanguage,
  setLanguage: (lang: Language) => {
    currentLanguage = lang;
    listeners.forEach((l) => l());
  },
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

export function useTranslation() {
  const lang = useSyncExternalStore(
    languageStore.subscribe,
    languageStore.getLanguage,
    () => 'id' as Language
  );

  const t = (key: string, fallback?: string): string => {
    return dictionary[lang]?.[key] ?? fallback ?? dictionary['id']?.[key] ?? key;
  };

  const toggleLanguage = () => {
    languageStore.setLanguage(lang === 'id' ? 'en' : 'id');
  };

  return {
    t,
    language: lang,
    setLanguage: languageStore.setLanguage,
    toggleLanguage,
  };
}

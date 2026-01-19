import 'server-only';
import type { Locale } from './i18n-config';

const dictionaries = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  'zh-TW': () => import('./dictionaries/zh-TW.json').then((module) => module.default),
  ja: () => import('./dictionaries/ja.json').then((module) => module.default),
  'zh-CN': () => import('./dictionaries/zh-CN.json').then((module) => module.default),
  fr: () => import('./dictionaries/fr.json').then((module) => module.default),
  de: () => import('./dictionaries/de.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => {
  if (dictionaries[locale]) {
    return dictionaries[locale]();
  }

  // Handle case mismatch or fallback
  const normalizedLocale = (locale as string) === 'zh-tw' ? 'zh-TW' : locale;
  if (dictionaries[normalizedLocale as Locale]) {
    return dictionaries[normalizedLocale as Locale]();
  }

  console.error(`Dictionary not found for locale: ${locale}`);
  return dictionaries['zh-TW'](); // Fallback to default
};

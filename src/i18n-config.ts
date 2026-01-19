export const i18n = {
  defaultLocale: 'zh-TW',
  locales: ['en', 'zh-TW', 'ja', 'zh-CN', 'fr', 'de'],
} as const;

export type Locale = (typeof i18n)['locales'][number];

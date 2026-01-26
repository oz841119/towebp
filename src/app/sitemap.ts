import { MetadataRoute } from 'next';
import { i18n } from '../i18n-config';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://towebp.com';
  
  // 為每個語言生成 URL
  const localeUrls = i18n.locales.map((locale) => ({
    url: `${baseUrl}/${locale}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: locale === i18n.defaultLocale ? 1.0 : 0.9,
    alternates: {
      languages: Object.fromEntries(
        i18n.locales.map((lang) => [lang, `${baseUrl}/${lang}`])
      ),
    },
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...localeUrls,
  ];
}

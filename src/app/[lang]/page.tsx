import { getDictionary } from '../../get-dictionary';
import { Locale } from '../../i18n-config';
import WebPConverter from '../../components/WebPConverter';
import RichContent from '../../components/RichContent';
import LanguageSwitcher from '../../components/LanguageSwitcher';

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://towebp.com';

  // BreadcrumbList 結構化資料
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': `${baseUrl}/${lang}`,
      },
    ],
  };

  // FAQPage 結構化資料
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': dictionary.seo.title,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': dictionary.seo.content,
        },
      },
      {
        '@type': 'Question',
        'name': dictionary.seo.benefit1Title.replace(':', ''),
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': dictionary.seo.benefit1Desc,
        },
      },
      {
        '@type': 'Question',
        'name': dictionary.seo.benefit2Title.replace(':', ''),
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': dictionary.seo.benefit2Desc,
        },
      },
    ],
  };

  // ImageObject 結構化資料（用於轉換器功能）
  const imageObjectJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    'headline': dictionary.hero.title,
    'description': dictionary.meta.description,
    'author': {
      '@type': 'Organization',
      'name': 'ToWebP',
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'ToWebP',
      'logo': {
        '@type': 'ImageObject',
        'url': `${baseUrl}/logo.png`,
      },
    },
    'inLanguage': lang,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(imageObjectJsonLd) }}
      />
      
      <div className="container mx-auto px-4 py-12 md:py-20 max-w-6xl relative">
        <div className="absolute top-4 right-4 md:top-8 md:right-8">
          <LanguageSwitcher />
        </div>
        <header className="text-center mb-16 space-y-4">
          <div className="inline-block bg-teal-50 text-teal-800 px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide uppercase mb-2">
            {dictionary.hero.badge}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 font-serif tracking-tight">
            {dictionary.hero.title}
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            {dictionary.hero.subtitle}
          </p>
        </header>

        <main>
          <WebPConverter dictionary={dictionary} />
        </main>

        <RichContent dictionary={dictionary} />
      </div>
    </>
  );
}

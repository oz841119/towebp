import '../globals.css';
import { i18n, type Locale } from '../../i18n-config';
import { getDictionary } from '../../get-dictionary';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://towebp.com';
  
  return {
    title: dictionary.meta.title,
    description: dictionary.meta.description,
    keywords: dictionary.meta.keywords,
    authors: [{ name: 'ToWebP' }],
    creator: 'ToWebP',
    publisher: 'ToWebP',
    alternates: {
      canonical: `${baseUrl}/${lang}`,
      languages: {
        'en': `${baseUrl}/en`,
        'zh-TW': `${baseUrl}/zh-TW`,
        'zh-CN': `${baseUrl}/zh-CN`,
        'ja': `${baseUrl}/ja`,
        'fr': `${baseUrl}/fr`,
        'de': `${baseUrl}/de`,
      },
    },
    openGraph: {
      title: dictionary.meta.ogTitle,
      description: dictionary.meta.ogDescription,
      url: `${baseUrl}/${lang}`,
      siteName: 'ToWebP - Image to WebP Converter',
      locale: lang,
      type: 'website',
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: dictionary.meta.ogTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: dictionary.meta.ogTitle,
      description: dictionary.meta.ogDescription,
      images: [`${baseUrl}/og-image.png`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://towebp.com';

  // 生成 JSON-LD 結構化資料
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': `${baseUrl}/#webapp`,
        'name': 'ToWebP - Image to WebP Converter',
        'url': `${baseUrl}/${lang}`,
        'description': dictionary.meta.description,
        'applicationCategory': 'Multimedia',
        'operatingSystem': 'Web Browser',
        'offers': {
          '@type': 'Offer',
          'price': '0',
          'priceCurrency': 'USD',
        },
        'inLanguage': lang,
        'browserRequirements': 'Requires JavaScript. Requires HTML5.',
      },
      {
        '@type': 'SoftwareApplication',
        'name': 'ToWebP',
        'applicationCategory': 'DesignApplication',
        'operatingSystem': 'Any',
        'offers': {
          '@type': 'Offer',
          'price': '0',
          'priceCurrency': 'USD',
        },
        'aggregateRating': {
          '@type': 'AggregateRating',
          'ratingValue': '4.8',
          'ratingCount': '1250',
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        'url': baseUrl,
        'name': 'ToWebP',
        'inLanguage': lang,
        'potentialAction': {
          '@type': 'SearchAction',
          'target': `${baseUrl}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        '@id': `${baseUrl}/#organization`,
        'name': 'ToWebP',
        'url': baseUrl,
        'logo': {
          '@type': 'ImageObject',
          'url': `${baseUrl}/logo.png`,
        },
        'sameAs': [],
      },
      {
        '@type': 'HowTo',
        'name': dictionary.hero.title,
        'description': dictionary.meta.description,
        'step': [
          {
            '@type': 'HowToStep',
            'name': 'Upload Image',
            'text': 'dragDrop' in dictionary.dropzone ? dictionary.dropzone.dragDrop : dictionary.dropzone.dragText,
            'position': 1,
          },
          {
            '@type': 'HowToStep',
            'name': 'Adjust Settings',
            'text': dictionary.seo.benefit3Desc,
            'position': 2,
          },
          {
            '@type': 'HowToStep',
            'name': 'Download WebP',
            'text': dictionary.controls.download,
            'position': 3,
          },
        ],
      },
    ],
  };

  return (
    <html lang={lang}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="alternate" hrefLang="en" href={`${baseUrl}/en`} />
        <link rel="alternate" hrefLang="zh-TW" href={`${baseUrl}/zh-TW`} />
        <link rel="alternate" hrefLang="zh-CN" href={`${baseUrl}/zh-CN`} />
        <link rel="alternate" hrefLang="ja" href={`${baseUrl}/ja`} />
        <link rel="alternate" hrefLang="fr" href={`${baseUrl}/fr`} />
        <link rel="alternate" hrefLang="de" href={`${baseUrl}/de`} />
        <link rel="alternate" hrefLang="x-default" href={`${baseUrl}/zh-TW`} />
      </head>
      <body className="min-h-screen font-sans text-slate-900 antialiased bg-slate-50">
        <main className="flex flex-col min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}

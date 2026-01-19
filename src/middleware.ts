import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { i18n } from './i18n-config';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

function getLocale(request: NextRequest): string | undefined {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // @ts-ignore locales are readonly
  const locales: string[] = i18n.locales;
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    locales
  );

  return matchLocale(languages, locales, i18n.defaultLocale);
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if there is any supported locale in the pathname
  // We check the first segment of the path
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => {
      // Strict check on the first segment to avoid partial detection issues
      // e.g. /zh-TW/foo -> segment is 'zh-TW'
      // /en/foo -> segment is 'en'
      const firstSegment = pathname.split('/')[1];
      return firstSegment !== locale;
    }
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);

    // Double check we are not already at the locale (case insensitive safeguard)
    const firstSegment = pathname.split('/')[1];
    if (firstSegment && firstSegment.toLowerCase() === locale?.toLowerCase()) {
      // If the case is wrong but the letters match, we might want to redirect to the canonical case
      // But for now let's just allow it if nextjs handles it, OR strictly redirect to canonical
      return NextResponse.redirect(
        new URL(
          `/${locale}${pathname.substring(firstSegment.length + 1)}`,
          request.url
        )
      );
    }

    // e.g. incoming request is /products
    // The new URL is now /en-US/products
    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`,
        request.url
      )
    );
  }
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};

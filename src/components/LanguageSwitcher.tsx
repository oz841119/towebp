'use client';

import { usePathname, useRouter } from 'next/navigation';
import { i18n, type Locale } from '../i18n-config';
import { Globe } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const redirectedPathName = (locale: Locale) => {
    if (!pathname) return '/';
    const segments = pathname.split('/');
    segments[1] = locale;
    return segments.join('/');
  };

  const handleLocaleChange = (locale: Locale) => {
    const newPath = redirectedPathName(locale);
    router.push(newPath);
    setIsOpen(false);
  };

  const localeNames: Record<Locale, string> = {
    'en': 'English',
    'zh-TW': '繁體中文',
    'ja': '日本語',
    'zh-CN': '简体中文',
    'fr': 'Français',
    'de': 'Deutsch'
  };

  const currentLocale = pathname?.split('/')[1] as Locale || i18n.defaultLocale;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors rounded-lg hover:bg-slate-50 cursor-pointer"
      >
        <Globe className="w-4 h-4" />
        <span>{localeNames[currentLocale] || currentLocale}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50">
          {i18n.locales.map((locale) => (
            <button
              key={locale}
              onClick={() => handleLocaleChange(locale)}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-teal-50 hover:text-teal-700 cursor-pointer
                ${currentLocale === locale ? 'text-teal-600 font-semibold bg-teal-50/50' : 'text-slate-600'}
              `}
            >
              {localeNames[locale]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

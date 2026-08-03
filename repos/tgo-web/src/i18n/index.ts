import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import language resources

import enTranslations from './locales/en.json';
import zhTranslations from './locales/zh.json';
import esTranslations from './locales/es-419.json';


/**
 * i18n Configuration for TKTLABS Web
 * Supports Latin American Spanish (default), English and Chinese
 */
const resources = {
  zh: {
    translation: zhTranslations
  },
  en: {
    translation: enTranslations
  },
  es: {
    translation: esTranslations
  }
};

// Determine initial language with support for 'system'/'auto' preference
const SUPPORTED_LANGS = ['zh', 'en', 'es'] as const;
type SupportedLang = typeof SUPPORTED_LANGS[number];

const mapToSupportedLang = (lng?: string | null): SupportedLang => {
  const code = (lng || '').toLowerCase();
  if (code.startsWith('zh')) return 'zh';
  if (code.startsWith('en')) return 'en';
  return 'es';
};

const detectSystemLang = (): SupportedLang => {
  if (typeof navigator !== 'undefined') {
    const cand = (Array.isArray((navigator as any).languages) && (navigator as any).languages[0]) || (navigator as any).language;
    return mapToSupportedLang(cand);
  }
  return 'es';
};

let storedPref: string | null = null;
try {
  storedPref = typeof localStorage !== 'undefined' ? localStorage.getItem('tgo-language') : null;
} catch {}

const initialLng: SupportedLang = !storedPref
  ? 'es'
  : (storedPref === 'system' || storedPref === 'auto')
  ? detectSystemLang()
  : (SUPPORTED_LANGS as readonly string[]).includes(storedPref)
    ? (storedPref as SupportedLang)
    : detectSystemLang();


i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'es', // Default to Latin American Spanish if detection fails
    lng: initialLng, // Respect stored 'system/auto' or detected language

    // Language detection options (kept for compatibility, but we manage our own preference)
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'tgo-language'
    },

    interpolation: {
      escapeValue: false // React already escapes values
    },

    // Debugging (disable in production)
    debug: import.meta.env.DEV
  });

// Keep <html lang> in sync
try {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('lang', initialLng);
  }
} catch {}

i18n.on('languageChanged', (lng) => {
  try {
    if (typeof document !== 'undefined') {
      const base = (lng || '').split('-')[0];
      document.documentElement.setAttribute('lang', base || initialLng);
    }
  } catch {}
});

export default i18n;

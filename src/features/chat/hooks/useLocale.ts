import { useState, useCallback } from 'react';

const STORAGE_KEY = 'wa-date-locale';

/**
 * Returns a locale string that is supported by Intl.DateTimeFormat.
 * Falls back to `'en-US'` if the stored or provided locale is invalid.
 */
function resolveSupportedLocale(locale: string): string {
  try {
    const supported = Intl.DateTimeFormat.supportedLocalesOf([locale]);
    if (supported.length > 0) return supported[0];
  } catch {
    // Intl may not be available in some environments
  }
  return 'en-US';
}

/**
 * Derives the initial date locale from the user's browser language,
 * falling back to stored preference, then `'en-US'`.
 *
 * Priority:
 * 1. Previously saved locale in localStorage (user's explicit choice)
 * 2. Browser language (navigator.language), validated via Intl
 * 3. `'en-US'` default
 */
function getInitialLocale(): string {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return resolveSupportedLocale(stored);
  } catch {
    // localStorage may be unavailable
  }

  // Bootstrap from the browser's language so non-US users see
  // the correct date/time format on their first visit.
  if (typeof navigator !== 'undefined' && navigator.language) {
    return resolveSupportedLocale(navigator.language);
  }

  return 'en-US';
}

/**
 * Manages the user's preferred date/time format locale independently
 * from the i18n UI language. Reads/writes to localStorage key `'wa-date-locale'`.
 *
 * The locale only affects how dates and times are displayed
 * (e.g., MM/DD vs DD/MM, 12h vs 24h), not the UI language.
 *
 * On first visit, the locale is bootstrapped from the browser's language
 * (via `navigator.language`) so users immediately see the correct format.
 * Once the user makes an explicit choice via the settings menu, that choice
 * is persisted and takes precedence on subsequent visits.
 */
export function useLocale() {
  const [locale, setLocaleState] = useState<string>(getInitialLocale);

  const setLocale = useCallback((newLocale: string) => {
    const resolved = resolveSupportedLocale(newLocale);
    setLocaleState(resolved);
    try {
      localStorage.setItem(STORAGE_KEY, resolved);
    } catch {
      // localStorage may be unavailable (quota exceeded, private browsing)
    }
  }, []);

  return { locale, setLocale };
}


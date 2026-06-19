import { useState, useCallback } from 'react';

const STORAGE_KEY = 'wa-date-locale';

/**
 * Returns a locale string that is supported by Intl.DateTimeFormat.
 * Falls back to a default if the stored or provided locale is invalid.
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
 * Manages the user's preferred date/time format locale independently
 * from the i18n language. Reads/writes to localStorage key 'wa-date-locale'.
 *
 * The locale only affects how dates and times are displayed
 * (e.g., MM/DD vs DD/MM, 12h vs 24h), not the UI language.
 */
export function useLocale() {
  const [locale, setLocaleState] = useState<string>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return resolveSupportedLocale(stored);
    } catch {
      // localStorage may be unavailable
    }
    return 'en-US';
  });

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


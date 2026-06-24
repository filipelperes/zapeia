import { createContext, useContext, useCallback, type ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const STORAGE_KEY = 'wa-date-locale';

/**
 * Returns a locale string that is supported by Intl.DateTimeFormat.
 * Falls back to `'en-US'` if the provided locale is invalid.
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
 * Derives the default locale from the user's browser language.
 * Falls back to `'en-US'`.
 */
function getDefaultLocale(): string {
  if (typeof navigator !== 'undefined' && navigator.language) {
    return resolveSupportedLocale(navigator.language);
  }
  return 'en-US';
}

// ─── Context ──────────────────────────────────────────────────────────

interface LocaleContextValue {
  locale: string;
  setLocale: (locale: string) => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

/**
 * Provider that manages the date-locale state and persists it to localStorage.
 * Wrap near the app root so all consumers share a single state.
 */
export function LocaleProvider({ children }: { children: ReactNode }) {
  const [storedLocale, setStoredLocale] = useLocalStorage(STORAGE_KEY, getDefaultLocale());
  const locale = resolveSupportedLocale(storedLocale);

  const setLocale = useCallback(
    (newLocale: string) => {
      const resolved = resolveSupportedLocale(newLocale);
      setStoredLocale(resolved);
    },
    [setStoredLocale],
  );

  return <LocaleContext.Provider value={{ locale, setLocale }}>{children}</LocaleContext.Provider>;
}

/**
 * Hook that returns the current date locale and a setter.
 *
 * When used inside a <LocaleProvider>, all consumers share a single
 * state (recommended). When no provider is found, falls back to
 * independent local state management so the hook always works
 * without requiring a wrapper (e.g., in tests).
 */
export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (ctx) return ctx;

  // Fallback: manage state independently when no provider is present
  const [locale, setLocaleValue] = useLocalStorage<string>(STORAGE_KEY, getDefaultLocale());

  const setLocale = useCallback(
    (newLocale: string) => {
      setLocaleValue(resolveSupportedLocale(newLocale));
    },
    [setLocaleValue],
  );

  return { locale: resolveSupportedLocale(locale), setLocale };
}

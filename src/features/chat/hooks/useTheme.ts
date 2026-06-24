import { useCallback, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'wa-theme';

function applyTheme(theme: Theme): void {
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

export function useTheme() {
  const [theme, setThemeValue] = useLocalStorage<Theme>(STORAGE_KEY, 'light');

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setTheme = useCallback(
    (newTheme: Theme) => {
      setThemeValue(newTheme);
    },
    [setThemeValue],
  );

  const toggleTheme = useCallback(() => {
    setThemeValue(theme === 'light' ? 'dark' : 'light');
  }, [theme, setThemeValue]);

  return { theme, toggleTheme, setTheme };
}

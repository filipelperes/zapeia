import { useState, useCallback } from 'react';

const STORAGE_KEY = 'wa-user-name';

/**
 * Manages the user's own name for bubble alignment.
 * Reads/writes to localStorage key 'wa-user-name'.
 * Empty string means no user is configured.
 */
export interface UserNameActions {
  userName: string;
  setUserName: (name: string) => void;
  clearUserName: () => void;
}

export function useUserName(): UserNameActions {
  const [userName, setUserNameState] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) ?? '';
    } catch {
      return '';
    }
  });

  const setUserName = useCallback((name: string) => {
    setUserNameState(name);
    try {
      localStorage.setItem(STORAGE_KEY, name);
    } catch {
      // localStorage may be unavailable (quota exceeded, private browsing)
    }
  }, []);

  const clearUserName = useCallback(() => {
    setUserNameState('');
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return { userName, setUserName, clearUserName };
}

import { useCallback } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

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
  const [userName, setUserNameValue, clearUserNameValue] = useLocalStorage<string>(STORAGE_KEY, '');

  const setUserName = useCallback(
    (name: string) => {
      setUserNameValue(name);
    },
    [setUserNameValue],
  );

  const clearUserName = useCallback(() => {
    clearUserNameValue();
  }, [clearUserNameValue]);

  return { userName, setUserName, clearUserName };
}

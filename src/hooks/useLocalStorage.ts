import { useState, useCallback } from 'react';

/**
 * Generic hook for persisting state in localStorage.
 *
 * Handles JSON serialization/deserialization automatically.
 * For plain strings stored without JSON (legacy data), falls back
 * to treating the raw value as the stored type.
 *
 * @param key - localStorage key
 * @param initialValue - Fallback value when nothing is stored
 * @returns [storedValue, setValue, removeValue]
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return initialValue;
      // Try JSON parse first (for non-string values or JSON-stringified strings)
      try {
        return JSON.parse(raw) as T;
      } catch {
        // Legacy plain string (not JSON-encoded)
        return raw as unknown as T;
      }
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T) => {
      setStoredValue(value);
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {
        // localStorage may be unavailable (quota exceeded, private browsing)
      }
    },
    [key],
  );

  const removeValue = useCallback(() => {
    setStoredValue(initialValue);
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

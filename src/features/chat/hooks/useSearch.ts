import { useState, useCallback } from 'react';

/**
 * Manages search state for filtering chat messages.
 * Provides query string, active state, and control functions.
 */
export function useSearch() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const toggleSearch = useCallback(() => {
    setIsSearching((prev) => {
      if (prev) {
        setQuery('');
      }
      return !prev;
    });
  }, []);

  const clearSearch = useCallback(() => {
    setQuery('');
    setIsSearching(false);
  }, []);

  return { query, isSearching, setQuery, clearSearch, toggleSearch };
}

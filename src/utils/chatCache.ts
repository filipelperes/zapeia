import type { ParsedMessage } from '@/features/chat/types';

const CACHE_KEY = 'wa-chat-cache';

interface CacheData {
  messages: ParsedMessage[];
  title: string;
  timestamp: number;
}

/**
 * Saves parsed chat messages and title to localStorage cache.
 * Handles errors gracefully (quota exceeded, private browsing).
 */
export function saveChatToCache(messages: ParsedMessage[], title: string): void {
  try {
    const data: CacheData = {
      messages,
      title,
      timestamp: Date.now(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // localStorage may be unavailable or full
    console.warn('Failed to save chat to localStorage cache');
  }
}

/**
 * Loads cached chat data from localStorage.
 * Returns null if no cache exists, data is corrupt, or localStorage is unavailable.
 */
export function loadChatFromCache(): { messages: ParsedMessage[]; title: string } | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;

    const data: CacheData = JSON.parse(raw);

    if (!Array.isArray(data.messages) || typeof data.title !== 'string') {
      return null;
    }

    return { messages: data.messages, title: data.title };
  } catch {
    // Corrupt data or localStorage unavailable
    return null;
  }
}

/**
 * Clears the cached chat data from localStorage.
 */
export function clearChatCache(): void {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch {
    // ignore
  }
}

import { useEffect, useState, useCallback, useRef } from 'react';
import { parseChat } from '@/utils/parsechat';
import type { ChatMessagesResult, ParsedMessage } from '@/features/chat/types';

const POLL_INTERVAL_MS = 5000;

/**
 * Appends a cache-busting timestamp to prevent the browser from serving
 * a stale HTTP-cached response when the file is moved or deleted.
 */
function bustCache(url: string): string {
  const sep = url.includes('?') ? '&' : '?';
  return `${url}${sep}_t=${Date.now()}`;
}

/**
 * Fetches and parses a WhatsApp chat export file.
 *
 * Auto-detects when `chat.txt` is added or removed:
 * - File returns 404 → `notFound = true`, polls with GET every 5s
 * - File loaded successfully → lightweight HEAD check every 5s detects removal
 * - When file appears or reappears → loads and renders automatically
 *
 * @param chatFilePath - Path to the chat text file relative to the base URL
 * @returns An object containing parsed messages, loading state, error, notFound, and retry
 */
export function useChatMessages(chatFilePath: string): ChatMessagesResult {
  const [messages, setMessages] = useState<ParsedMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [notFound, setNotFound] = useState(false);
  const cancelledRef = useRef(false);
  const loadCountRef = useRef(0);
  /** Mirror `notFound` in a ref so the interval callback always reads the latest value */
  const notFoundRef = useRef(false);

  // Sync ref with state
  useEffect(() => {
    notFoundRef.current = notFound;
  }, [notFound]);

  const loadChat = useCallback(async () => {
    const currentLoad = ++loadCountRef.current;
    cancelledRef.current = false;
    setIsLoading(true);
    setError(null);

    try {
      // bustCache ensures we never get a stale HTTP-cached 200 when the file was removed
      const response = await fetch(bustCache(chatFilePath));

      if (response.status === 404) {
        if (!cancelledRef.current && currentLoad === loadCountRef.current) {
          setNotFound(true);
          setMessages([]);
        }
        return;
      }

      if (!response.ok) {
        throw new Error(`Falha ao carregar arquivo: ${response.statusText}`);
      }

      const text = await response.text();

      if (!cancelledRef.current && currentLoad === loadCountRef.current) {
        setMessages(parseChat(text));
        setNotFound(false);
      }
    } catch (err) {
      if (!cancelledRef.current && currentLoad === loadCountRef.current) {
        const error = err instanceof Error ? err : new Error('Erro desconhecido');
        console.error('Erro ao carregar chat:', error);
        setError(error);
      }
    } finally {
      if (!cancelledRef.current && currentLoad === loadCountRef.current) {
        setIsLoading(false);
      }
    }
  }, [chatFilePath]);

  // Initial fetch + periodic health check (GET when notFound, HEAD when loaded)
  useEffect(() => {
    cancelledRef.current = false;
    loadChat();

    const intervalId = window.setInterval(async () => {
      if (cancelledRef.current) return;

      if (notFoundRef.current) {
        // File not yet available → full GET to detect when it appears
        loadChat();
      } else {
        // File is loaded → lightweight HEAD to detect when it's removed
        try {
          const res = await fetch(bustCache(chatFilePath), { method: 'HEAD' });
          if (res.status === 404 && !cancelledRef.current) {
            setMessages([]);
            setNotFound(true);
          }
        } catch {
          // Ignore transient network errors during health check
        }
      }
    }, POLL_INTERVAL_MS);

    return () => {
      cancelledRef.current = true;
      clearInterval(intervalId);
    };
  }, [loadChat, chatFilePath]);

  const retry = useCallback(() => {
    loadChat();
  }, [loadChat]);

  return { messages, isLoading, error, notFound, retry };
}

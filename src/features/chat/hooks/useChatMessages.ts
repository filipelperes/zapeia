import { useEffect, useState, useCallback, useRef } from 'react';
import { parseChat } from '@/utils/parsechat';
import i18n from '@/lib/i18n';
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
 * Detects when the response is NOT the actual chat file.
 *
 * Vite's dev server returns `200` with `index.html` (Content-Type: text/html)
 * for any request to a missing file in `public/` – the SPA fallback.
 * The real `chat.txt` would have Content-Type: text/plain or similar.
 */
function isFileNotFound(response: Response): boolean {
  return (
    response.status === 404 ||
    (response.headers?.get?.('content-type') ?? '').includes('text/html')
  );
}

/**
 * Fetches and parses a WhatsApp chat export file.
 *
 * Auto-detects when `chat.txt` is added, removed, or modified:
 * - File returns 404 / SPA fallback HTML → `notFound = true`, renders EmptyState
 * - File appears/reappears/modified → re-parses and renders automatically
 * - Same content → no-op (avoids unnecessary re-renders)
 *
 * @param chatFilePath - Path to the chat text file relative to the base URL
 * @returns An object containing parsed messages, loading state, error, notFound, and retry
 */
export function useChatMessages(chatFilePath: string): ChatMessagesResult {
  const [messages, setMessages] = useState<ParsedMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const cancelledRef = useRef(false);
  const loadCountRef = useRef(0);
  const lastContentRef = useRef<string | null>(null);

  // Keep a ref of chatFilePath to avoid stale closures in the interval callback
  const chatFilePathRef = useRef(chatFilePath);

  // Sync ref with state
  useEffect(() => {
    chatFilePathRef.current = chatFilePath;
  }, [chatFilePath]);

  /**
   * Shared handler for both initial fetch and interval polling.
   *
   * When called from `fetchChat`, pass `currentLoad` to guard against
   * stale promises resolving after the effect has re-run.
   * The interval never passes it (freshness is guaranteed by the cleanup).
   */
  async function handleResponse(response: Response, loadCount?: number): Promise<void> {
    // Stale guard: ignore if a newer effect cycle has started
    if (loadCount !== undefined && loadCount !== loadCountRef.current) return;

    if (isFileNotFound(response)) {
      if (!cancelledRef.current) {
        setMessages([]);
        setNotFound(true);
      }
      return;
    }

    if (!response.ok) {
      throw new Error(i18n.t('error.failedToLoadFile', { statusText: response.statusText }));
    }

    const text = await response.text();
    if (cancelledRef.current) return;

    // Only update if content actually changed (avoids unnecessary re-renders)
    if (text !== lastContentRef.current) {
      lastContentRef.current = text;
      setMessages(parseChat(text));
      setNotFound(false);
    }
  }

  // Initial fetch + periodic health check
  useEffect(() => {
    cancelledRef.current = false;
    const currentLoad = ++loadCountRef.current;

    async function fetchChat() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(bustCache(chatFilePathRef.current));
        await handleResponse(response, currentLoad);
      } catch (err) {
        if (!cancelledRef.current && currentLoad === loadCountRef.current) {
          const error = err instanceof Error ? err : new Error(i18n.t('error.unknownError'));
          console.error(i18n.t('error.errorLoadingChat'), error);
          setError(error);
        }
      } finally {
        if (!cancelledRef.current && currentLoad === loadCountRef.current) {
          setIsLoading(false);
        }
      }
    }

    fetchChat();

    // Poll every 5s to detect file removal, re-addition, or content changes
    const intervalId = window.setInterval(async () => {
      if (cancelledRef.current) return;

      try {
        const response = await fetch(bustCache(chatFilePathRef.current));
        await handleResponse(response);
      } catch {
        // Ignore transient network errors during health check
      }
    }, POLL_INTERVAL_MS);

    return () => {
      cancelledRef.current = true;
      clearInterval(intervalId);
    };
  }, [chatFilePath, refreshTrigger]);

  const retry = useCallback(() => {
    setRefreshTrigger((n) => n + 1);
  }, []);

  return { messages, isLoading, error, notFound, retry };
}

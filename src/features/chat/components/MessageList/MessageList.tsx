import { memo, useRef, useEffect, useMemo, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useVirtualizer } from '@tanstack/react-virtual';
import { ChatBubble } from '@/features/chat/components/ChatBubble';
import { DateSeparator } from '@/features/chat/components/DateSeparator';
import { useLocale } from '@/features/chat/hooks/useLocale';
import type { ParsedMessage } from '@/features/chat/types';

interface MessageListProps {
  messages: ParsedMessage[];
  searchQuery?: string;
  myName?: string;
}

function isNewDay(current: ParsedMessage, previous: ParsedMessage | undefined): boolean {
  if (!previous) return true;
  return current.date !== previous.date;
}

function matchesSearch(message: ParsedMessage, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  return (
    message.content.toLowerCase().includes(q) ||
    message.sender.toLowerCase().includes(q)
  );
}

/** Scroll-to-top arrow icon */
function ArrowUpIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
    </svg>
  );
}

/** Scroll-to-bottom arrow icon */
function ArrowDownIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
    </svg>
  );
}

const SCROLL_THRESHOLD = 200;
/** Estimated height per message row — virtualizer uses this before measuring */
const ROW_ESTIMATE = 80;

/**
 * Renders a virtualized (performant) scrollable list of WhatsApp messages
 * with date separators. Only visible DOM nodes are rendered — items outside
 * the viewport are recycled. The data order (chronological) is never changed.
 *
 * Supports optional search filtering by content or sender name.
 * Auto-scrolls to the bottom when new messages arrive.
 */
export const MessageList = memo(function MessageList({ messages, searchQuery, myName }: MessageListProps) {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);
  const [atTop, setAtTop] = useState(true);
  const [atBottom, setAtBottom] = useState(true);

  const filteredMessages = useMemo(() => {
    if (!searchQuery) return messages;
    return messages.filter((msg) => matchesSearch(msg, searchQuery));
  }, [messages, searchQuery]);

  // Stable ref to filteredMessages — used by getItemKey below so that the
  // callback identity never changes, preventing unnecessary virtualizer
  // recomputation when only the filter results change.
  const filteredMessagesRef = useRef(filteredMessages);
  filteredMessagesRef.current = filteredMessages;

  // Memoize virtualizer callbacks to prevent cascading re-renders.
  // The tanstack-virtual skill explicitly warns: "Not memoizing the
  // estimateSize function (causes re-renders)" — same applies to getItemKey.
  const estimateSize = useCallback(() => ROW_ESTIMATE, []);
  const getItemKey = useCallback(
    (index: number) => {
      const msg = filteredMessagesRef.current[index];
      return `${msg.date}-${msg.time}-${msg.sender}-${index}`;
    },
    [], // stable identity — reads from ref instead of closing over filteredMessages
  );
  const measureEl = useCallback(
    (el: Element | null) => el?.getBoundingClientRect().height ?? ROW_ESTIMATE,
    [],
  );

  // Custom scrollToFn enables smooth scrolling via scrollToIndex({ behavior: 'smooth' }).
  // Falls back to scrollTop when scrollTo isn't available (jsdom).
  const scrollToFn = useCallback(
    (offset: number, { behavior }: { behavior?: ScrollBehavior }, instance: { scrollElement?: HTMLElement | null }) => {
      const el = instance.scrollElement;
      if (!el) return;
      if (typeof el.scrollTo === 'function') {
        if (behavior === 'smooth') {
          el.scrollTo({ top: offset, behavior: 'smooth' });
        } else {
          el.scrollTo({ top: offset });
        }
      } else {
        el.scrollTop = offset;
      }
    },
    [],
  );

  // Stabilise all virtualizer callbacks to prevent cascading re-renders.
  // Every inline function in the options object creates a new reference on each
  // render, causing useVirtualizer to internally diff its options and potentially
  // recompute layout — even when nothing meaningful changed.
  const getScrollElement = useCallback(() => containerRef.current, []);

  const virtualizerOptions = useMemo(
    () => ({
      count: filteredMessages.length,
      getScrollElement,
      estimateSize,
      overscan: 10,
      getItemKey,
      measureElement: measureEl,
      scrollToFn,
    }),
    [filteredMessages.length, getScrollElement, estimateSize, getItemKey, measureEl, scrollToFn],
  );

  const virtualizer = useVirtualizer(virtualizerOptions);

  const virtualItems = virtualizer.getVirtualItems();
  /** When the container has no scrollable area (e.g. jsdom tests, zero-height
   *  containers), the virtualizer returns 0 items. Fall back to flat rendering
   *  so tests and edge-cases still work. */
  const useVirtualization = virtualItems.length > 0;

  // Auto-scroll to bottom on initial load, and when new messages arrive
  // but only if user was already at the bottom (not mid-scroll).
  const prevLength = useRef(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const count = filteredMessages.length;
    if (prevLength.current === 0 && count > 0) {
      if (useVirtualization) {
        virtualizer.scrollToIndex(count - 1, { align: 'end' });
      } else {
        bottomRef.current?.scrollIntoView({ behavior: 'auto' });
      }
    } else if (count > prevLength.current && atBottom) {
      if (useVirtualization) {
        virtualizer.scrollToIndex(count - 1, { align: 'end' });
      } else {
        bottomRef.current?.scrollIntoView({ behavior: 'auto' });
      }
    }
    prevLength.current = count;
  }, [filteredMessages, atBottom, virtualizer, useVirtualization]);

  const updateScrollState = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    setAtTop(scrollTop <= SCROLL_THRESHOLD);
    setAtBottom(scrollTop + clientHeight >= scrollHeight - SCROLL_THRESHOLD);
  }, []);

  const scrollToTop = useCallback(() => {
    if (useVirtualization) {
      virtualizer.scrollToIndex(0, { align: 'start', behavior: 'smooth' });
    } else {
      containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [virtualizer, useVirtualization]);

  const scrollToBottom = useCallback(() => {
    const count = filteredMessages.length;
    if (count > 0) {
      if (useVirtualization) {
        virtualizer.scrollToIndex(count - 1, { align: 'end', behavior: 'smooth' });
      } else {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [filteredMessages.length, virtualizer, useVirtualization]);

  const showScrollToTop = !atTop;
  const showScrollToBottom = !atBottom;

  if (filteredMessages.length === 0 && searchQuery) {
    return (
      <div className="flex-1 overflow-y-auto px-2 py-3">
        <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-300 text-sm">
          {t('chat.noResultsFound')}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 relative">
      <div
        ref={containerRef}
        onScroll={updateScrollState}
        className="absolute inset-0 overflow-y-auto px-2 py-3"
      >
        {useVirtualization ? (
          <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative', width: '100%' }}>
            {virtualItems.map((virtualRow) => {
              const message = filteredMessages[virtualRow.index];
              const showDateSeparator = isNewDay(message, filteredMessages[virtualRow.index - 1]);
              return (
                <div
                  key={virtualRow.key}
                  data-index={virtualRow.index}
                  ref={virtualizer.measureElement}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  {showDateSeparator && <DateSeparator date={message.date} time={message.time} locale={locale} />}
                  <ChatBubble message={message} myName={myName} searchQuery={searchQuery} locale={locale} />
                </div>
              );
            })}
          </div>
        ) : (
          // Fallback: render all items when the container has no scrollable area
          // (e.g. jsdom tests). This path is also taken for very small lists
          // where virtualization overhead is unnecessary.
          filteredMessages.map((message, index) => {
            const showDateSeparator = isNewDay(message, filteredMessages[index - 1]);
            return (
              <div key={`${message.date}-${message.time}-${message.sender}-${index}`}>
                {showDateSeparator && <DateSeparator date={message.date} time={message.time} locale={locale} />}
                <ChatBubble message={message} myName={myName} searchQuery={searchQuery} locale={locale} />
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Floating scroll buttons */}
      {showScrollToTop && (
        <button
          onClick={scrollToTop}
          className="absolute top-3 right-3 z-[1] w-9 h-9 flex items-center justify-center rounded-full bg-white/90 dark:bg-[#1F2C33]/90 text-gray-600 dark:text-[#E9EDEF] shadow-md hover:bg-white dark:hover:bg-[#2F3D46] transition-all border border-gray-200 dark:border-[#2F3D46] backdrop-blur-sm"
          aria-label="Scroll to top"
        >
          <ArrowUpIcon />
        </button>
      )}
      {showScrollToBottom && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-3 right-3 z-[1] w-9 h-9 flex items-center justify-center rounded-full bg-white/90 dark:bg-[#1F2C33]/90 text-gray-600 dark:text-[#E9EDEF] shadow-md hover:bg-white dark:hover:bg-[#2F3D46] transition-all border border-gray-200 dark:border-[#2F3D46] backdrop-blur-sm"
          aria-label="Scroll to bottom"
        >
          <ArrowDownIcon />
        </button>
      )}
    </div>
  );
});

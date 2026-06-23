import { memo, useRef, useEffect, useMemo, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ChatBubble } from '@/features/chat/components/ChatBubble';
import { DateSeparator } from '@/features/chat/components/DateSeparator';
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

/**
 * Renders a scrollable list of WhatsApp messages with date separators.
 * Supports optional search filtering by content or sender name.
 * Auto-scrolls to the bottom when new messages arrive.
 */
export const MessageList = memo(function MessageList({ messages, searchQuery, myName }: MessageListProps) {
  const { t } = useTranslation();
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [atTop, setAtTop] = useState(true);
  const [atBottom, setAtBottom] = useState(true);

  const filteredMessages = useMemo(() => {
    if (!searchQuery) return messages;
    return messages.filter((msg) => matchesSearch(msg, searchQuery));
  }, [messages, searchQuery]);

  // Auto-scroll to bottom on initial load, and when new messages arrive
  // but only if user was already at the bottom (not mid-scroll).
  const prevLength = useRef(0);
  useEffect(() => {
    if (prevLength.current === 0) {
      // Initial auto-scroll to bottom
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (filteredMessages.length > prevLength.current && atBottom) {
      // Auto-scroll only when user is at bottom and new messages arrive
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    prevLength.current = filteredMessages.length;
  }, [filteredMessages, atBottom]);

  const updateScrollState = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    setAtTop(scrollTop <= SCROLL_THRESHOLD);
    setAtBottom(scrollTop + clientHeight >= scrollHeight - SCROLL_THRESHOLD);
  }, []);

  const scrollToTop = useCallback(() => {
    containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const showScrollToTop = !atTop;
  const showScrollToBottom = !atBottom;

  if (filteredMessages.length === 0 && searchQuery) {
    return (
      <div className="flex-1 overflow-y-auto px-2 py-3">
        <div className="flex items-center justify-center h-full text-gray-400 text-sm">
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
        {filteredMessages.map((message, index) => {
          const showDateSeparator = isNewDay(message, filteredMessages[index - 1]);
          return (
            <div key={`${message.date}-${message.time}-${index}`}>
              {showDateSeparator && <DateSeparator date={message.date} time={message.time} />}
              <ChatBubble message={message} myName={myName} searchQuery={searchQuery} />
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Floating scroll buttons */}
      {showScrollToTop && (
        <button
          onClick={scrollToTop}
          className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/90 dark:bg-[#1F2C33]/90 text-gray-600 dark:text-[#E9EDEF] shadow-md hover:bg-white dark:hover:bg-[#2F3D46] transition-all border border-gray-200 dark:border-[#2F3D46] backdrop-blur-sm"
          aria-label="Scroll to top"
        >
          <ArrowUpIcon />
        </button>
      )}
      {showScrollToBottom && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-3 right-3 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/90 dark:bg-[#1F2C33]/90 text-gray-600 dark:text-[#E9EDEF] shadow-md hover:bg-white dark:hover:bg-[#2F3D46] transition-all border border-gray-200 dark:border-[#2F3D46] backdrop-blur-sm"
          aria-label="Scroll to bottom"
        >
          <ArrowDownIcon />
        </button>
      )}
    </div>
  );
});

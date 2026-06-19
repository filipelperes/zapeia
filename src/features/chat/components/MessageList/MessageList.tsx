import { memo, useRef, useEffect, useMemo } from 'react';
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

/**
 * Renders a scrollable list of WhatsApp messages with date separators.
 * Supports optional search filtering by content or sender name.
 * Auto-scrolls to the bottom when new messages arrive.
 */
export const MessageList = memo(function MessageList({ messages, searchQuery, myName }: MessageListProps) {
  const { t } = useTranslation();
  const bottomRef = useRef<HTMLDivElement>(null);

  const filteredMessages = useMemo(() => {
    if (!searchQuery) return messages;
    return messages.filter((msg) => matchesSearch(msg, searchQuery));
  }, [messages, searchQuery]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [filteredMessages]);

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
    <div className="flex-1 overflow-y-auto px-2 py-3">
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
  );
});

import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageTime } from '@/features/chat/components/MessageTime';
import { MediaContent } from '@/features/chat/components/MediaContent';
import { SystemMessage } from '@/features/chat/components/SystemMessage';
import type { ParsedMessage } from '@/features/chat/types';

interface ChatBubbleProps {
  message: ParsedMessage;
  myName?: string;
  searchQuery?: string;
  /** Locale string for date/time formatting. Passed down to MessageTime. */
  locale?: string;
}

function SenderName({ name }: { name: string }) {
  return (
    <span className="block text-sm font-semibold text-[#06CF9C] leading-tight mb-0.5">
      {name}
    </span>
  );
}

function DeletedMessage() {
  const { t } = useTranslation();
  return (
    <span className="italic line-through text-gray-400 text-xs">
      {t('chat.deletedMessage')}
    </span>
  );
}

function EditedIndicator() {
  const { t } = useTranslation();
  return (
    <span className="text-[10px] text-gray-400 italic ml-1">
      {t('chat.edited')}
    </span>
  );
}

function MessageBody({ type, content, searchQuery }: { type: ParsedMessage['type']; content: string; searchQuery?: string }) {
  if (type === 'deleted') {
    return <DeletedMessage />;
  }
  return <MediaContent type={type} content={content} searchQuery={searchQuery} />;
}

/**
 * Renders a single WhatsApp-style chat bubble.
 *
 * - System messages are rendered as centered notifications
 * - Group messages show sender name with green color
 * - Own messages (sender matches myName) appear green and right-aligned
 * - Deleted messages show a strikethrough placeholder
 * - Messages appear as white bubbles on the WhatsApp beige background
 */
export const ChatBubble = memo(function ChatBubble({ message, myName, searchQuery, locale }: ChatBubbleProps) {
  const { sender, content, date, time, type, edited } = message;

  if (type === 'system') {
    return <SystemMessage content={content} />;
  }

  const isOwn = myName && sender.toLowerCase() === myName.toLowerCase();

  return (
    <div data-own={isOwn ? 'true' : 'false'} className={`flex flex-col px-4 my-0.5 ${isOwn ? 'items-end' : 'items-start'}`}>
      <div
        className={`max-w-[85%] w-fit rounded-lg shadow-sm px-3 py-1.5 ${
          isOwn ? 'bg-[#D9FDD3] dark:bg-[#005C4B]' : 'bg-white dark:bg-[#1F2C33]'
        }`}
      >
        {!isOwn && <SenderName name={sender} />}
        <div className="text-sm leading-relaxed break-words text-gray-900 dark:text-[#E9EDEF]">
          <MessageBody type={type} content={content} searchQuery={searchQuery} />
        </div>
        <div className="flex items-center justify-end gap-1 -mb-1 mt-0.5">
          {edited && <EditedIndicator />}
          <MessageTime date={date} time={time} locale={locale} />
        </div>
      </div>
    </div>
  );
});

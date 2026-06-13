import { memo } from 'react';
import { MessageTime } from '@/features/chat/components/MessageTime';
import { MediaContent } from '@/features/chat/components/MediaContent';
import { SystemMessage } from '@/features/chat/components/SystemMessage';
import type { ParsedMessage } from '@/features/chat/types';

interface ChatBubbleProps {
  message: ParsedMessage;
  myName?: string;
  searchQuery?: string;
}

function SenderName({ name }: { name: string }) {
  return (
    <span className="block text-sm font-semibold text-[#06CF9C] leading-tight mb-0.5">
      {name}
    </span>
  );
}

function DeletedMessage() {
  return (
    <span className="italic line-through text-gray-400 text-xs">
      Mensagem apagada
    </span>
  );
}

function EditedIndicator() {
  return (
    <span className="text-[10px] text-gray-400 italic ml-1">
      Editada
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
export const ChatBubble = memo(function ChatBubble({ message, myName, searchQuery }: ChatBubbleProps) {
  const { sender, content, date, time, type, edited } = message;

  if (type === 'system') {
    return <SystemMessage content={content} />;
  }

  const isOwn = myName && sender.toLowerCase() === myName.toLowerCase();

  return (
    <div className={`flex flex-col px-4 my-0.5 ${isOwn ? 'items-end' : 'items-start'}`}>
      <div
        className={`max-w-[85%] w-fit rounded-lg shadow-sm px-3 py-1.5 ${
          isOwn ? 'chat-bubble-own bg-[#D9FDD3]' : 'chat-bubble bg-white'
        }`}
      >
        {!isOwn && <SenderName name={sender} />}
        <div className="chat-bubble-text text-sm leading-relaxed break-words text-gray-900">
          <MessageBody type={type} content={content} searchQuery={searchQuery} />
        </div>
        <div className="flex items-center justify-end gap-1 -mb-1 mt-0.5">
          {edited && <EditedIndicator />}
          <MessageTime date={date} time={time} />
        </div>
      </div>
    </div>
  );
});

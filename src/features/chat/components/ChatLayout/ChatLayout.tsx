import { memo } from 'react';
import { ChatHeader } from '@/features/chat/components/ChatHeader';
import { MessageList } from '@/features/chat/components/MessageList';
import { useSearch } from '@/features/chat/hooks/useSearch';
import type { ParsedMessage } from '@/features/chat/types';

interface ChatLayoutProps {
  messages: ParsedMessage[];
  title?: string;
  myName?: string;
  onNameChange?: (name: string) => void;
  onNameClear?: () => void;
}

/** WhatsApp-style chat background pattern SVG (data URI) */
const CHAT_BG_PATTERN = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D6CDC1' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`;

function InputBar() {
  return (
      <div className="chat-input sticky bottom-0 flex items-center gap-2 px-4 py-2 bg-[#F0F2F5] border-t border-gray-200">
      <button className="chat-input-icon p-1.5 text-gray-500 hover:text-gray-700 transition-colors" aria-label="Emoji">
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
        </svg>
      </button>
      <div className="chat-input-field flex-1 bg-white rounded-lg px-3 py-1.5 text-sm text-gray-400 cursor-text">
        Digite uma mensagem
      </div>
      <button className="chat-input-icon p-1.5 text-gray-500 hover:text-gray-700 transition-colors" aria-label="Anexar">
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M1.816 11.556L10.26 3.113a3.826 3.826 0 015.414 5.415l-8.447 8.444a1.913 1.913 0 01-2.707-2.706l7.738-7.738a.956.956 0 011.353 1.352l-7.03 7.03a.478.478 0 00.676.677l7.03-7.03a1.913 1.913 0 00-1.353-3.27 1.913 1.913 0 00-1.353.556L5.193 13.263a3.826 3.826 0 005.415 5.414l8.447-8.445a3.826 3.826 0 00-5.414-5.414L1.816 11.556z" />
        </svg>
      </button>
      <button className="chat-input-icon p-1.5 text-gray-500 hover:text-gray-700 transition-colors" aria-label="Enviar">
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z" />
        </svg>
      </button>
    </div>
  );
}

function NoMessages() {
  return (
    <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
      Nenhuma mensagem encontrada.
    </div>
  );
}

/**
 * Full WhatsApp Web-style chat layout with header, message list, and input bar.
 * Mirrors the WhatsApp Web desktop app look and feel with the classic beige background.
 * Supports inline search via the useSearch hook, connecting header search to message filtering.
 */
export const ChatLayout = memo(function ChatLayout({ messages, title, myName, onNameChange, onNameClear }: ChatLayoutProps) {
  const { query, isSearching, setQuery, toggleSearch } = useSearch();

  return (
    <div
      className="chat-bg flex flex-col h-full w-full md:rounded-xl md:shadow-2xl overflow-hidden"
      style={{ backgroundColor: '#E5DDD5', backgroundImage: CHAT_BG_PATTERN }}
    >
      <ChatHeader
        title={title}
        isSearching={isSearching}
        searchQuery={query}
        onToggleSearch={toggleSearch}
        onSearchQueryChange={setQuery}
        userName={myName ?? ''}
        onNameChange={onNameChange}
        onNameClear={onNameClear}
      />
      {messages.length === 0 && !isSearching ? (
        <NoMessages />
      ) : (
        <MessageList messages={messages} searchQuery={isSearching ? query : undefined} myName={myName} />
      )}
      <InputBar />
    </div>
  );
});

import { useEffect, useMemo, useState } from 'react';
import { useChatMessages, ChatLayout, EmptyState, ErrorDisplay, useUserName } from '@/features/chat';
import { loadChatFromCache, saveChatToCache, clearChatCache } from '@/utils/chatCache';
import { deriveConversationTitle } from '@/utils/parsechat';
import type { ParsedMessage } from '@/features/chat/types';

const CHAT_FILE = `${import.meta.env.BASE_URL}chat.txt`;

/** WhatsApp Chat Viewer — main application component */
function App() {
  const { messages, isLoading, error, notFound, retry } = useChatMessages(CHAT_FILE);
  const [cachedMessages, setCachedMessages] = useState<ParsedMessage[] | null>(null);
  const [chatText, setChatText] = useState<string | null>(null);
  const { userName, setUserName, clearUserName } = useUserName();

  // Load cached data on mount for instant display
  useEffect(() => {
    const cached = loadChatFromCache();
    if (cached) {
      setCachedMessages(cached.messages);
    }
  }, []);

  // When the chat file is removed (404), clear cached data to show EmptyState
  useEffect(() => {
    if (notFound && messages.length === 0) {
      setCachedMessages(null);
      clearChatCache();
    }
  }, [notFound, messages.length]);

  // Capture raw chat text for title derivation
  useEffect(() => {
    if (messages.length > 0 && !chatText) {
      fetch(CHAT_FILE)
        .then((r) => r.text())
        .then((text) => setChatText(text))
        .catch(() => { /* ignore — title extraction is optional */ });
    }
  }, [messages, chatText]);

  // Derive conversation title from the raw chat text + parsed messages
  const title = useMemo(() => {
    if (chatText) {
      return deriveConversationTitle(chatText, messages);
    }
    if (messages.length > 0) {
      // Fallback: derive from messages directly (no raw text yet)
      const senders = [...new Set(messages.map((m) => m.sender).filter((s) => s !== 'system'))];
      if (senders.length === 1) return `Conversa com ${senders[0]}`;
      if (senders.length === 2) return `${senders[0]} e ${senders[1]}`;
    }
    return 'Histórico do WhatsApp';
  }, [chatText, messages]);

  // When fresh data arrives, save to cache with the title
  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      saveChatToCache(messages, title);
    }
  }, [isLoading, messages, title]);

  // Only use cached messages when file exists; if 404, show nothing immediately
  const displayMessages = messages.length > 0
    ? messages
    : (!notFound ? (cachedMessages ?? []) : []);

  // --- Estado: arquivo não configurado (404) ---
  if (notFound && displayMessages.length === 0) {
    return <EmptyState />;
  }

  // --- Estado: carregando (primeira carga, sem cache) ---
  if (isLoading && displayMessages.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-screen w-screen bg-[#111B21] text-white">
        <div className="animate-spin rounded-full h-14 w-14 border-[3px] border-t-[#00A884] border-b-[#00A884] border-l-transparent border-r-transparent" />
        <p className="mt-6 text-gray-400 text-base">Carregando conversas...</p>
      </div>
    );
  }

  // --- Estado: erro real (não é 404) ---
  if (error && displayMessages.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen w-screen bg-[#111B21] p-0 md:p-4">
        <div className="h-full w-full md:h-[calc(100%-2rem)] md:w-4/5 max-w-[1200px] bg-[#111B21] rounded-xl flex items-center justify-center">
          <ErrorDisplay message={error.message} onRetry={retry} />
        </div>
      </div>
    );
  }

  // --- Estado: conversa carregada ---
  return (
    <div className="flex justify-center items-center h-screen w-screen bg-[#111B21] p-0 md:p-4">
      <div className="h-full w-full md:h-[calc(100%-2rem)] md:w-4/5 max-w-[1200px]">
        <ChatLayout
          messages={displayMessages}
          title={title}
          myName={userName}
          onNameChange={setUserName}
          onNameClear={clearUserName}
        />
      </div>
    </div>
  );
}

export default App;

import { lazy, Suspense, useEffect, useState } from 'react';
import { useChatMessages, EmptyState, ErrorDisplay, useUserName } from '@/features/chat';
import type { ParsedMessage } from '@/features/chat';
import { loadChatFromCache, saveChatToCache, clearChatCache } from '@/utils/chatCache';
import { deriveConversationTitle } from '@/utils/parsechat';
import { useTranslation } from 'react-i18next';

const CHAT_FILE = `${import.meta.env.BASE_URL}chat.txt`;

const ChatLayout = lazy(() =>
  import('@/features/chat/components/ChatLayout').then((m) => ({ default: m.ChatLayout })),
);

/** Loading fallback for lazy-loaded ChatLayout */
function ChatLoadingFallback() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen bg-[#111B21] text-white">
      <div className="animate-spin rounded-full h-14 w-14 border-[3px] border-t-[#00A884] border-b-[#00A884] border-l-transparent border-r-transparent" />
      <p className="mt-6 text-gray-300 text-base">{t('app.loadingConversations')}</p>
    </div>
  );
}

/** WhatsApp Chat Viewer — main application component */
function App() {
  const { messages, isLoading, error, notFound, retry } = useChatMessages(CHAT_FILE);
  // Lazy initialize cached messages from localStorage on first render
  const [cachedMessages] = useState<ParsedMessage[] | null>(() => {
    const cached = loadChatFromCache();
    return cached ? cached.messages : null;
  });
  const [chatText, setChatText] = useState<string | null>(null);
  const { userName, setUserName, clearUserName } = useUserName();
  const { t } = useTranslation();

  // When the chat file is removed (404), clear localStorage cache
  useEffect(() => {
    if (notFound && messages.length === 0) {
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
  function deriveTitle(): string {
    if (chatText) {
      return deriveConversationTitle(chatText, messages, t);
    }
    if (messages.length > 0) {
      const senders = [...new Set(messages.map((m) => m.sender).filter((s) => s !== 'system'))];
      if (senders.length === 1) return t('app.conversationWith', { name: senders[0] });
      if (senders.length === 2) return t('app.conversationWithTwo', { name1: senders[0], name2: senders[1] });
    }
    return t('app.whatsappHistory');
  }
  const title = deriveTitle();

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

  // --- State: chat file not configured (404) ---
  if (notFound && displayMessages.length === 0) {
    return <EmptyState />;
  }

  // --- State: loading (first load, no cache) ---
  if (isLoading && displayMessages.length === 0) {
    return <ChatLoadingFallback />;
  }

  // --- State: actual error (not 404) ---
  if (error && displayMessages.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen w-screen bg-[#111B21] p-0 md:p-4">
        <div className="h-full w-full md:h-[calc(100%-2rem)] md:w-4/5 max-w-[1200px] bg-[#111B21] rounded-xl flex items-center justify-center">
          <ErrorDisplay message={error.message} onRetry={retry} />
        </div>
      </div>
    );
  }

  // --- State: conversation loaded ---
  return (
    <div className="flex justify-center items-center h-screen w-screen bg-[#111B21] p-0 md:p-4">
      <div className="h-full w-full md:h-[calc(100%-2rem)] md:w-4/5 max-w-[1200px]">
        <Suspense fallback={<ChatLoadingFallback />}>
          <ChatLayout
            messages={displayMessages}
            title={title}
            myName={userName}
            onNameChange={setUserName}
            onNameClear={clearUserName}
          />
        </Suspense>
      </div>
    </div>
  );
}

export default App;

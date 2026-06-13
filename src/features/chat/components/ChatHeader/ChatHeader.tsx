import { memo, useMemo, useRef, useEffect } from 'react';
import { ThemeToggle } from '@/features/chat/components/ThemeToggle';
import { UserMenu } from '@/features/chat/components/UserMenu';

interface ChatHeaderProps {
  title?: string;
  isSearching?: boolean;
  searchQuery?: string;
  onToggleSearch?: () => void;
  onSearchQueryChange?: (query: string) => void;
  userName?: string;
  onNameChange?: (name: string) => void;
  onNameClear?: () => void;
}

function getInitials(title: string): string {
  return title
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function Avatar({ title }: { title: string }) {
  const initials = useMemo(() => getInitials(title), [title]);

  return (
    <div className="chat-avatar w-10 h-10 rounded-full bg-[#6BA89E] flex items-center justify-center text-white font-bold text-sm shrink-0">
      {initials}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    </svg>
  );
}

/** Renders a WhatsApp Web-style chat header with dark green background */
export const ChatHeader = memo(function ChatHeader({
  title,
  isSearching = false,
  searchQuery = '',
  onToggleSearch,
  onSearchQueryChange,
  userName,
  onNameChange,
  onNameClear,
}: ChatHeaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearching) {
      inputRef.current?.focus();
    }
  }, [isSearching]);

  const resolvedTitle = title ?? 'Histórico do WhatsApp';

  return (
    <header className="chat-header sticky top-0 z-10 flex items-center gap-3 px-4 py-3 bg-[#075E54] text-white shadow-md">
      <Avatar title={resolvedTitle} />
      <div className="flex-1 min-w-0">
        {isSearching ? (
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange?.(e.target.value)}
            placeholder="Pesquisar..."
            className="w-full bg-[#1F2C33] text-white placeholder-[#8696A0] rounded-lg px-3 py-1.5 text-sm outline-none border border-transparent focus:border-[#00A884] transition-colors"
          />
        ) : (
          <>
            <h1 className="text-base font-semibold truncate">
              {resolvedTitle}
            </h1>
          </>
        )}
      </div>
      <div className="flex items-center gap-4 text-white">
        <ThemeToggle />
        {isSearching ? (
          <button
            onClick={onToggleSearch}
            className="hover:opacity-80 transition-opacity"
            aria-label="Fechar pesquisa"
          >
            <CloseIcon />
          </button>
        ) : (
          <button
            onClick={onToggleSearch}
            className="hover:opacity-80 transition-opacity"
            aria-label="Pesquisar"
          >
            <SearchIcon />
          </button>
        )}
        <UserMenu userName={userName} onNameChange={onNameChange} onNameClear={onNameClear} />
      </div>
    </header>
  );
});

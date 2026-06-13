import { memo, useCallback, useEffect, useRef, useState } from 'react';

function MenuIcon() {
  return (
    <svg className="w-5 h-5 cursor-pointer hover:opacity-80" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </svg>
  );
}

interface UserMenuProps {
  userName?: string;
  onNameChange?: (name: string) => void;
  onNameClear?: () => void;
}

/** Dropdown menu with user name configuration */
export const UserMenu = memo(function UserMenu({ userName = '', onNameChange, onNameClear }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
        setEditing(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  // Focus input when editing
  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  const handleSave = useCallback(() => {
    const trimmed = nameInput.trim();
    if (trimmed) {
      onNameChange?.(trimmed);
    } else {
      onNameClear?.();
    }
    setEditing(false);
    setOpen(false);
  }, [nameInput, onNameChange, onNameClear]);

  const handleEditClick = useCallback(() => {
    setNameInput(userName);
    setEditing(true);
  }, [userName]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') handleSave();
      if (e.key === 'Escape') {
        setEditing(false);
        setOpen(false);
      }
    },
    [handleSave],
  );

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="hover:opacity-80 transition-opacity"
        aria-label="Menu"
      >
        <MenuIcon />
      </button>

      {open && (
        <div className="chat-setting-dropdown absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
          {editing ? (
            <div className="p-3">
              <p className="text-xs text-gray-500 mb-2 font-medium">
                Seu nome nas mensagens
              </p>
              <input
                ref={inputRef}
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ex: Nome Sobrenome"
                className="chat-setting-input w-full px-3 py-2 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:border-[#00A884] transition-colors"
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => {
                    setEditing(false);
                    setOpen(false);
                  }}
                  className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs text-white bg-[#00A884] rounded-lg hover:bg-[#06CF9C] transition-colors"
                >
                  <CheckIcon />
                  Salvar
                </button>
              </div>
            </div>
          ) : (
            <div className="py-1">
              <div className="px-3 py-2 text-xs text-gray-400 font-medium uppercase tracking-wide">
                Configurações
              </div>
              <button
                onClick={handleEditClick}
                  className="chat-menu-item w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                {userName ? (
                  <>
                    <span className="block text-xs text-gray-400">Seu nome</span>
                    <span className="block text-sm font-medium text-[#06CF9C]">{userName}</span>
                  </>
                ) : (
                  <span className="block text-sm text-gray-600">Definir meu nome...</span>
                )}
              </button>
              {userName && (
                <button
                  onClick={() => {
                    onNameClear?.();
                    setOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 transition-colors"
                >
                  Limpar nome
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

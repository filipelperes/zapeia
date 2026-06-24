import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocale } from '@/features/chat/hooks/useLocale';

/** Commonly available locale codes for date/time formatting */
const DATE_LOCALES = [
  { code: 'en-US', label: 'English (US)' },
  { code: 'en-GB', label: 'English (UK)' },
  { code: 'pt-BR', label: 'Português (BR)' },
  { code: 'pt-PT', label: 'Português (PT)' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'it', label: 'Italiano' },
  { code: 'ja', label: '日本語' },
  { code: 'zh-CN', label: '中文' },
] as const;

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

/** Dropdown menu with user name and date format configuration */
export const UserMenu = memo(function UserMenu({ userName = '', onNameChange, onNameClear }: UserMenuProps) {
  const { t } = useTranslation();
  const { locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [localeEditing, setLocaleEditing] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [localeInput, setLocaleInput] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const localeInputRef = useRef<HTMLInputElement>(null);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
        setEditing(false);
        setLocaleEditing(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  // Focus input when editing name
  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  // Focus input when editing locale
  useEffect(() => {
    if (localeEditing) {
      localeInputRef.current?.focus();
    }
  }, [localeEditing]);

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

  const handleLocaleSelect = useCallback((code: string) => {
    setLocale(code);
    setLocaleEditing(false);
  }, [setLocale]);

  const handleCustomLocale = useCallback(() => {
    const trimmed = localeInput.trim();
    if (trimmed) {
      setLocale(trimmed);
    }
    setLocaleEditing(false);
  }, [localeInput, setLocale]);

  const handleLocaleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') handleCustomLocale();
      if (e.key === 'Escape') {
        setLocaleEditing(false);
        setOpen(false);
      }
    },
    [handleCustomLocale],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') handleSave();
      if (e.key === 'Escape') {
        setEditing(false);
        setLocaleEditing(false);
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
        aria-label={t('userMenu.menu')}
      >
        <MenuIcon />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-[#1F2C33] rounded-lg shadow-xl border border-gray-200 dark:border-[#2F3D46] z-50 overflow-hidden">
          {editing ? (
            <div className="p-3">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium">
                {t('userMenu.yourNameInMessages')}
              </p>
              <input
                ref={inputRef}
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('userMenu.namePlaceholder')}
                className="w-full px-3 py-2 text-sm text-gray-900 dark:text-[#E9EDEF] bg-gray-50 dark:bg-[#111B21] border border-gray-300 dark:border-[#2F3D46] rounded-lg outline-none focus:border-[#00A884] transition-colors"
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => {
                    setEditing(false);
                    setOpen(false);
                  }}
                  className="px-3 py-1.5 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                >
                  {t('userMenu.cancel')}
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs text-white bg-[#00A884] rounded-lg hover:bg-[#06CF9C] transition-colors"
                >
                  <CheckIcon />
                  {t('userMenu.save')}
                </button>
              </div>
            </div>
          ) : localeEditing ? (
            <div className="p-3">
              {/* Header with back button */}
              <div className="flex items-center gap-2 mb-3">
                <button
                  onClick={() => setLocaleEditing(false)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-[#2F3D46] rounded transition-colors"
                  aria-label={t('userMenu.back')}
                >
                  <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                  </svg>
                </button>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {t('userMenu.dateFormat')}
                </p>
              </div>
              {/* Quick-select common locales */}
              <div className="grid grid-cols-2 gap-1 mb-3">
                {DATE_LOCALES.map((loc) => (
                  <button
                    key={loc.code}
                    onClick={() => handleLocaleSelect(loc.code)}
                    className={`text-left px-2 py-1.5 text-xs rounded transition-colors ${
                      locale === loc.code
                        ? 'bg-[#00A884]/10 text-[#00A884] font-medium'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2F3D46]'
                    }`}
                  >
                    {loc.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 dark:text-[#8696A0] mb-1">{t('userMenu.customLocale')}</p>
              <input
                ref={localeInputRef}
                type="text"
                value={localeInput}
                onChange={(e) => setLocaleInput(e.target.value)}
                onKeyDown={handleLocaleKeyDown}
                placeholder={t('userMenu.localePlaceholder')}
                className="w-full px-3 py-2 text-sm text-gray-900 dark:text-[#E9EDEF] bg-gray-50 dark:bg-[#111B21] border border-gray-300 dark:border-[#2F3D46] rounded-lg outline-none focus:border-[#00A884] transition-colors"
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => setLocaleEditing(false)}
                  className="px-3 py-1.5 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                >
                  {t('userMenu.cancel')}
                </button>
                <button
                  onClick={handleCustomLocale}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs text-white bg-[#00A884] rounded-lg hover:bg-[#06CF9C] transition-colors"
                >
                  <CheckIcon />
                  {t('userMenu.apply')}
                </button>
              </div>
            </div>
          ) : (
            <div className="py-1">
              <div className="px-3 py-2 text-xs text-gray-400 dark:text-[#8696A0] font-medium uppercase tracking-wide">
                {t('userMenu.settings')}
              </div>
              <button
                onClick={handleEditClick}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-[#E9EDEF] hover:bg-gray-100 dark:hover:bg-[#2F3D46] transition-colors"
              >
                {userName ? (
                  <>
                    <span className="block text-xs text-gray-400 dark:text-[#8696A0]">{t('userMenu.yourName')}</span>
                    <span className="block text-sm font-medium text-[#06CF9C]">{userName}</span>
                  </>
                ) : (
                  <span className="block text-sm text-gray-600 dark:text-gray-400">{t('userMenu.setMyName')}</span>
                )}
              </button>
              {userName && (
                <button
                  onClick={() => {
                    onNameClear?.();
                    setOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-[#2F3D46] transition-colors"
                >
                  {t('userMenu.clearName')}
                </button>
              )}
              {/* Date format locale selector */}
              <div className="border-t border-gray-100 dark:border-[#2F3D46] mt-1 pt-1">
                <button
                  onClick={() => {
                    setLocaleInput(locale);
                    setLocaleEditing(true);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-[#E9EDEF] hover:bg-gray-100 dark:hover:bg-[#2F3D46] transition-colors"
                >
                  <span className="block text-xs text-gray-400 dark:text-[#8696A0]">{t('userMenu.dateFormat')}</span>
                  <span className="block text-sm font-medium text-[#06CF9C]">{locale}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

import { memo } from 'react';
import { useTranslation } from 'react-i18next';

interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
}

function WarningIcon() {
  return (
    <svg
      className="w-10 h-10 text-red-400"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
      />
    </svg>
  );
}

function RetryIcon() {
  return (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
    </svg>
  );
}

/**
 * WhatsApp-style error display with icon, message, and optional retry button.
 * Replaces native alert() with an inline UI component.
 */
export const ErrorDisplay = memo(function ErrorDisplay({
  message,
  onRetry,
}: ErrorDisplayProps) {
  const { t } = useTranslation();
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 p-8 text-center"
      role="alert"
    >
      <WarningIcon />
      <div className="max-w-sm">
        <p className="text-sm text-red-400 font-medium mb-1">
          {t('chat.couldNotLoadMessages')}
        </p>
        <p className="text-xs text-gray-400">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#00A884] hover:bg-[#06CF9C] rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#00A884]/50"
          aria-label={t('chat.tryAgain')}
        >
          <RetryIcon />
          {t('chat.tryAgain')}
        </button>
      )}
    </div>
  );
});

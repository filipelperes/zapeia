import { memo } from 'react';
import { useTranslation, Trans } from 'react-i18next';

function ZapIcon() {
  return (
    <svg className="w-16 h-16 text-[#00A884]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.05 4.91A9.816 9.816 0 0012.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01zm-7.01 15.24c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.264 8.264 0 01-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.183 8.183 0 012.41 5.83c.02 4.54-3.68 8.23-8.22 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.24-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.44s.17-.25.25-.41c.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.4-.56-.41-.14-.01-.31-.01-.48-.01s-.44.06-.66.31c-.23.25-.87.85-.87 2.08s.89 2.41 1.01 2.58c.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.07-.1-.23-.16-.48-.27z" />
    </svg>
  );
}

function WatchDot() {
  return (
    <span className="relative flex h-3 w-3">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00A884] opacity-75" />
      <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00A884]" />
    </span>
  );
}

/**
 * Empty state screen shown when no chat.txt file is configured.
 * Provides clear setup instructions and auto-detects when the file appears.
 */
export const EmptyState = memo(function EmptyState() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-[#111B21] text-white px-6 py-12">
      {/* Logo / Icon */}
      <div className="mb-6">
        <ZapIcon />
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold mb-2 text-center">
        Zapeia
      </h1>
      <p className="text-[#8696A0] text-base mb-10 text-center max-w-md">
        {t('emptyState.title')}
      </p>

      {/* Setup card */}
      <div className="w-full max-w-lg bg-[#1F2C33] rounded-2xl p-8 shadow-lg border border-[#2F3D46]">
        <h2 className="text-lg font-semibold mb-6 text-center">
          {t('emptyState.subtitle')}
        </h2>

        <ol className="space-y-5">
          <li className="flex gap-4">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#00A884] text-white text-sm font-bold flex items-center justify-center mt-0.5">
              1
            </span>
            <div>
              <p className="text-sm font-medium">{t('emptyState.step1Title')}</p>
              <p className="text-xs text-[#8696A0] mt-1">
                <Trans i18nKey="emptyState.step1Description">
                  In the group/conversation, click <strong>More &rarr; Export chat</strong> and choose <strong>without media</strong>.
                </Trans>
              </p>
            </div>
          </li>

          <li className="flex gap-4">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#00A884] text-white text-sm font-bold flex items-center justify-center mt-0.5">
              2
            </span>
            <div>
              <p className="text-sm font-medium">{t('emptyState.step2Title')}</p>
              <p className="text-xs text-[#8696A0] mt-1">
                <Trans i18nKey="emptyState.step2Description">
                  Save the file as <code className="text-[#06CF9C] bg-[#111B21] px-1.5 py-0.5 rounded text-xs">public/chat.txt</code> in the project root.
                </Trans>
              </p>
            </div>
          </li>

          <li className="flex gap-4">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#00A884] text-white text-sm font-bold flex items-center justify-center mt-0.5">
              3
            </span>
            <div>
              <p className="text-sm font-medium">{t('emptyState.step3Title')}</p>
              <p className="text-xs text-[#8696A0] mt-1">
                <Trans i18nKey="emptyState.step3Description">
                  Copy photos, videos, and audio to <code className="text-[#06CF9C] bg-[#111B21] px-1.5 py-0.5 rounded text-xs">public/media/</code>.
                </Trans>
              </p>
            </div>
          </li>
        </ol>

        <div className="mt-8 pt-5 border-t border-[#2F3D46] flex items-center gap-3 text-xs text-[#8696A0]">
          <WatchDot />
          <Trans as="span" i18nKey="emptyState.watchingFile">
            Watching <code className="text-[#06CF9C]">public/chat.txt</code> &mdash; the screen will update automatically as soon as the file is detected.
          </Trans>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-10 text-xs text-[#8696A0] text-center max-w-md leading-relaxed">
        <Trans i18nKey="emptyState.privacyNotice">
          <strong className="text-white">Zapeia</strong> is a local viewer. No data is sent to external servers.
          Everything runs exclusively in your browser.
        </Trans>
      </p>
    </div>
  );
});

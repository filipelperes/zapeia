import { memo, useMemo } from 'react';
import { formatDateString } from '@/utils/formatDateString';

interface MessageTimeProps {
  date: string;
  time: string;
  /** Locale string for date/time formatting. Avoids per-component context reads. */
  locale?: string;
}

/** Renders a formatted message timestamp (WhatsApp-style, right-aligned, gray) */
export const MessageTime = memo(function MessageTime({ date, time, locale = 'en-US' }: MessageTimeProps) {
  const formatted = useMemo(() => formatDateString(date, time, locale), [date, time, locale]);

  return (
    <span className="text-[11px] text-gray-400 select-none">
      {formatted}
    </span>
  );
});

import { memo, useMemo } from 'react';
import { formatDateString } from '@/utils/formatDateString';
import { useLocale } from '@/features/chat/hooks/useLocale';

interface MessageTimeProps {
  date: string;
  time: string;
}

/** Renders a formatted message timestamp (WhatsApp-style, right-aligned, gray) */
export const MessageTime = memo(function MessageTime({ date, time }: MessageTimeProps) {
  const { locale } = useLocale();
  const formatted = useMemo(() => formatDateString(date, time, locale), [date, time, locale]);

  return (
    <span className="text-[11px] text-gray-400 select-none">
      {formatted}
    </span>
  );
});

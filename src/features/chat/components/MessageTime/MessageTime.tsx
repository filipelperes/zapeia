import { memo } from 'react';
import { formatDateString } from '@/utils/formatDateString';

interface MessageTimeProps {
  date: string;
  time: string;
}

/** Renders a formatted message timestamp (WhatsApp-style, right-aligned, gray) */
export const MessageTime = memo(function MessageTime({ date, time }: MessageTimeProps) {
  const formatted = formatDateString(date, time);

  return (
    <span className="text-[11px] text-gray-400 select-none">
      {formatted}
    </span>
  );
});

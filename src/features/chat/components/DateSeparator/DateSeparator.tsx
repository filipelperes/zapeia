import { memo } from 'react';
import { formatDateString } from '@/utils/formatDateString';
import { useLocale } from '@/features/chat/hooks/useLocale';

interface DateSeparatorProps {
  date: string;
  time: string;
}

/** Renders a WhatsApp-style date separator line between messages */
export const DateSeparator = memo(function DateSeparator({ date, time }: DateSeparatorProps) {
  const { locale } = useLocale();
  return (
    <div className="flex justify-center my-2">
      <span className="chat-date px-3 py-1 text-xs text-gray-500 bg-white/80 rounded-full shadow-sm select-none">
        {formatDateString(date, time, locale)}
      </span>
    </div>
  );
});

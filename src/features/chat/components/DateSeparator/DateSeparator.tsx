import { memo, useMemo } from 'react';
import { formatDateString } from '@/utils/formatDateString';

interface DateSeparatorProps {
  date: string;
  time: string;
  /** Locale string for date/time formatting. Avoids per-component context reads. */
  locale?: string;
}

/** Renders a WhatsApp-style date separator line between messages */
export const DateSeparator = memo(function DateSeparator({ date, time, locale = 'en-US' }: DateSeparatorProps) {
  const formatted = useMemo(() => formatDateString(date, time, locale), [date, time, locale]);

  return (
    <div className="flex justify-center my-2">
      <span className="px-3 py-1 text-xs text-gray-500 dark:text-[#8696A0] bg-white/80 dark:bg-[#182229] rounded-full shadow-sm select-none">
        {formatted}
      </span>
    </div>
  );
});

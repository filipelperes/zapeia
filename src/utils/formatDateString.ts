import { parse } from 'date-fns';

/** Supported WhatsApp date/time formats for parsing exported chat files */
const DATE_FORMATS = [
   'dd/MM/yy HH:mm',
   'd/M/yy HH:mm',
   'dd/MM/yyyy HH:mm',
   'd/M/yyyy HH:mm',
   'M/d/yy HH:mm',
   'M/d/yyyy HH:mm',
   'dd/MM/yy HH:mm:ss',
   'd/M/yy HH:mm:ss',
   'dd/MM/yy h:mm:ss a',
   'd/M/yy h:mm:ss a',
   'd/M/yy h:mm a',
   'd/M/yyyy h:mm a',
   'M/d/yy h:mm a',
] as const;

const LOCALE_OPTIONS: Intl.DateTimeFormatOptions = {
   day: '2-digit',
   month: '2-digit',
   year: 'numeric',
   hour: '2-digit',
   minute: '2-digit',
} as const;

/**
 * Simple bounded cache for formatDateString results.
 *
 * Maps `date|time|locale` → formatted string. Prevents re-parsing the same
 * date/time combo through all 18 format patterns on repeated calls — critical
 * when locale changes trigger a re-render of hundreds of messages at once.
 *
 * Bounded at 50 000 entries to prevent memory leaks in long-running sessions.
 */
const formatCache = new Map<string, string>();
const MAX_CACHE_SIZE = 50_000;

/**
 * Formats a WhatsApp date/time pair into a locale-aware string.
 *
 * Results are cached internally by `(date, time, locale)` so that bulk
 * re-renders (e.g. locale switch) resolve in O(1) per message rather
 * than iterating all 18 format patterns each time.
 *
 * @param date - Date portion from the WhatsApp export
 * @param time - Time portion from the WhatsApp export
 * @param locale - Locale string for date/time formatting (default 'en-US')
 * @returns A formatted date-time string
 */
export function formatDateString(date: string, time: string, locale: string = 'en-US'): string {
   const cacheKey = `${date}\0${time}\0${locale}`;

   const cached = formatCache.get(cacheKey);
   if (cached !== undefined) return cached;

   const dateTimeStr = `${date} ${time}`;

   for (const fmt of DATE_FORMATS) {
      try {
         const parsed = parse(dateTimeStr, fmt, new Date());
         if (!isNaN(parsed.getTime())) {
            const result = parsed.toLocaleString(locale, LOCALE_OPTIONS);
            if (formatCache.size < MAX_CACHE_SIZE) {
               formatCache.set(cacheKey, result);
            }
            return result;
         }
      } catch {
         continue;
      }
   }

   if (formatCache.size < MAX_CACHE_SIZE) {
      formatCache.set(cacheKey, time);
   }
   return time;
}

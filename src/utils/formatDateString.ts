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

export function formatDateString(date: string, time: string): string {
   const dateTimeStr = `${date} ${time}`;

   for (const fmt of DATE_FORMATS) {
      try {
         const parsed = parse(dateTimeStr, fmt, new Date());
         if (!isNaN(parsed.getTime())) {
            return parsed.toLocaleString('pt-BR', LOCALE_OPTIONS);
         }
      } catch {
         continue;
      }
   }

   return time;
}

import type { JSX } from 'react';

const FORMAT_REGEX = /(\*{1,2}|_{1,2}|~{1,2}|`{1,3})([\s\S]+?)\1/g;
const URL_REGEX = /(https?:\/\/[^\s]+)/g;

type FormatClassMap = Record<string, string>;

const FORMAT_CLASSES: FormatClassMap = {
   '*': 'font-medium',
   '**': 'font-medium',
   '_': 'italic',
   '__': 'italic',
   '~': 'line-through',
   '~~': 'line-through',
};

/** Escapes regex special characters in a string */
function escapeRegex(str: string): string {
   return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Splits text into segments, wrapping matches for `highlightQuery` in a
 * highlighted `<span>`.
 */
function highlightText(text: string, query: string | undefined): (string | JSX.Element)[] {
   if (!query) return [text];

   const escaped = escapeRegex(query);
   const parts = text.split(new RegExp(`(${escaped})`, 'gi'));

   return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase()
         ? (
            <span
               key={`hl-${i}`}
               className="bg-yellow-200/80 text-black rounded px-0.5 font-medium"
            >
               {part}
            </span>
         )
         : part,
   );
}

function renderFormattedSegment(
   delimiter: string,
   content: string,
   key: string,
): JSX.Element {
   const trimmed = content.trim();
   if (!trimmed) {
      return <span key={key}>{delimiter + content + delimiter}</span>;
   }

   if (delimiter === '`' || delimiter === '```') {
      return <code key={key}>{content}</code>;
   }

   return (
      <span key={key} className={FORMAT_CLASSES[delimiter] ?? ''}>
         {content}
      </span>
   );
}

function renderLink(segment: string, key: string): JSX.Element {
   return (
      <a
         key={key}
         href={segment}
         target="_blank"
         rel="noopener noreferrer"
         className="text-blue-600 underline hover:text-blue-800"
      >
         {segment}
      </a>
   );
}

function splitLinks(text: string): (string | JSX.Element)[] {
   const parts: (string | JSX.Element)[] = [];
   let lastIndex = 0;
   let match: RegExpExecArray | null;

   while ((match = URL_REGEX.exec(text)) !== null) {
      if (match.index > lastIndex) {
         parts.push(text.slice(lastIndex, match.index));
      }
      parts.push(renderLink(match[1], `url-${match.index}`));
      lastIndex = match.index + match[1].length;
   }

   if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
   }

   return parts;
}

/**
 * Formats WhatsApp-style text markers (*bold*, _italic_, ~strikethrough~, `code`)
 * into JSX elements, optionally highlighting segments that match `highlightQuery`.
 */
export const formatWhatsAppText = (
   text: string,
   highlightQuery?: string,
): (string | JSX.Element)[] => {
   if (!text) return [];

   const parts: (string | JSX.Element)[] = [];
   let lastIndex = 0;
   let match: RegExpExecArray | null;

   while ((match = FORMAT_REGEX.exec(text)) !== null) {
      const [fullMatch, delimiter, content] = match;
      const startIndex = match.index;

      if (startIndex > lastIndex) {
         // Apply highlight to the plain text segment
         const raw = text.slice(lastIndex, startIndex);
         parts.push(...highlightText(raw, highlightQuery));
      }

      parts.push(
         renderFormattedSegment(delimiter, content, `fmt-${startIndex}-${delimiter}`),
      );

      lastIndex = startIndex + fullMatch.length;
   }

   if (lastIndex < text.length) {
      const raw = text.slice(lastIndex);
      parts.push(...highlightText(raw, highlightQuery));
   }

   return parts.flatMap((part, i) => {
      if (typeof part !== 'string') return [part];
      // splitLinks doesn't support highlight text; apply highlight after link splitting
      const linkParts = splitLinks(part);
      if (!highlightQuery) return linkParts;
      return linkParts.flatMap((lp) =>
         typeof lp === 'string' ? highlightText(lp, highlightQuery) : [lp],
      );
   });
};

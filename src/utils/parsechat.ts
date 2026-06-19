import type { TFunction } from 'i18next';
import type { ParsedMessage, MessageType } from '@/types';

/** Regex to match WhatsApp chat export lines */
const MESSAGE_REGEX =
   /^(\d{1,2}\/\d{1,2}\/\d{2,4}), (\d{1,2}:\d{2}(?::\d{2})?(?:\s?[APMapm]{2})?) - (.*?)(?:: (.*))?$/;

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'] as const;
const FILE_ATTACHED_REGEX = /\s*\(file attached\)\s*/gi;
const MEDIA_OMITTED = '<Media omitted>';
const THIS_MESSAGE_WAS_DELETED = 'This message was deleted';
const YOU_DELETED_THIS_MESSAGE = 'You deleted this message';
const THIS_MESSAGE_WAS_EDITED = '<This message was edited>';

function detectFileType(content: string): MessageType | null {
   // Remove (file attached) suffix before detecting file extension
   const cleanContent = content.replace(FILE_ATTACHED_REGEX, '').trim();
   const lastDotIndex = cleanContent.lastIndexOf('.');
   // Must have a dot that's not at start or end
   if (lastDotIndex <= 0 || lastDotIndex >= cleanContent.length - 1) return null;

   const ext = cleanContent.slice(lastDotIndex + 1).toLowerCase();

   if (IMAGE_EXTENSIONS.includes(ext as typeof IMAGE_EXTENSIONS[number])) {
      return 'image';
   }

   switch (ext) {
      case 'mp4': return 'video';
      case 'opus': return 'audio';
      case 'vcf': return 'contact';
      default: return null;
   }
}

function detectMessageType(content: string, isSystem: boolean): MessageType {
   if (isSystem) return 'system';
   if (content === MEDIA_OMITTED) return 'media';
   if (content === THIS_MESSAGE_WAS_DELETED || content === YOU_DELETED_THIS_MESSAGE) return 'deleted';

   const hasFileAttached = content.includes('(file attached)');
   const fileType = detectFileType(content);

   if (hasFileAttached && fileType) return fileType;
   if (hasFileAttached) return 'generic';
   if (fileType) return fileType;

   return 'message';
}

function parseMessageLine(line: string): ParsedMessage | null {
   const match = line.match(MESSAGE_REGEX);
   if (!match) return null;

   const [, date, time, sender, rawContent] = match;
   const isSystem = !rawContent;
   let content = rawContent || sender;

   // Detect and strip "<This message was edited>" suffix
   let edited: true | undefined;
   if (!isSystem && content.endsWith(THIS_MESSAGE_WAS_EDITED)) {
      edited = true;
      content = content.slice(0, -THIS_MESSAGE_WAS_EDITED.length).trimEnd();
   }

   return {
      date,
      time,
      sender: isSystem ? 'system' : sender,
      content,
      type: detectMessageType(content, isSystem),
      ...(edited ? { edited } : {}),
   };
}

const GROUP_CREATION_REGEX = /created group "([^"]+)"/;

/**
 * Extracts the group name from the first WhatsApp "created group" system message found.
 *
 * @param text - Raw WhatsApp chat export text
 * @returns The group name if found, or null otherwise
 */
export function extractGroupName(text: string): string | null {
   if (!text) return null;
   const normalized = text.replace(/\r/g, '');
   const match = normalized.match(GROUP_CREATION_REGEX);
   return match ? match[1] : null;
}

/**
 * Derives a human-readable conversation title from a WhatsApp export.
 *
 * Priority:
 * 1. Group name extracted from the "created group" system message
 * 2. Single sender → "Conversation with {name}"
 * 3. Two senders → "{name1} and {name2}"
 * 4. Fallback → "WhatsApp History"
 *
 * @param rawText - Raw chat export text (used for group name extraction)
 * @param messages - Parsed messages (used for sender analysis when no group name)
 * @returns A derived conversation title
 */
export function deriveConversationTitle(rawText: string, messages: ParsedMessage[], t?: TFunction): string {
  // Priority 1: group name from "created group" system message
  const groupName = extractGroupName(rawText);
  if (groupName) return groupName;

  // Priority 2 onwards: analyze unique non-system senders
  const senders = [...new Set(messages.map((m) => m.sender).filter((s) => s !== 'system'))];

  if (senders.length === 0) return t?.('app.whatsappHistory') ?? 'WhatsApp History';
  if (senders.length === 1) return t?.('app.conversationWith', { name: senders[0] }) ?? `Conversation with ${senders[0]}`;
  if (senders.length === 2) return t?.('app.conversationWithTwo', { name1: senders[0], name2: senders[1] }) ?? `${senders[0]} and ${senders[1]}`;

  return t?.('app.whatsappHistory') ?? 'WhatsApp History';
}

export function parseChat(text: string): ParsedMessage[] {
   if (!text) return [];

   // Normalize CRLF (Windows) to LF: remove \r characters before splitting
   const normalized = text.replace(/\r/g, '');
   const lines = normalized.split('\n');

   return lines.reduce<ParsedMessage[]>((acc, line) => {
      const parsed = parseMessageLine(line);

      if (parsed) {
         acc.push(parsed);
      } else if (acc.length > 0) {
         const trimmed = line.trim();
         if (trimmed) {
            const lastMessage = acc[acc.length - 1];
            lastMessage.content += '\n' + trimmed;
         }
      }

      return acc;
   }, []);
}

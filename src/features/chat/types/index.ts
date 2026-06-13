import type { JSX } from 'react';

/** Supported media subtypes for WhatsApp media messages */
export type MediaSubType = 'image' | 'video' | 'audio' | 'contact' | 'generic';

/** All possible message types in a parsed WhatsApp chat */
export type MessageType = 'message' | 'media' | 'deleted' | 'system' | MediaSubType;

/** A single parsed message from WhatsApp chat export */
export interface ParsedMessage {
  /** Message date (raw from chat file) */
  date: string;
  /** Message time (raw from chat file) */
  time: string;
  /** Sender name (or "system" for system messages) */
  sender: string;
  /** Message content text */
  content: string;
  /** Detected message type */
  type: MessageType;
  /** Whether this message was edited (appends "Editada" indicator) */
  edited?: boolean;
}

/** WhatsApp text formatting delimiters */
export type Delimiter = '*' | '**' | '_' | '__' | '~' | '~~';

/** Result of formatted text processing */
export type FormattedTextSegment = string | JSX.Element;

/** Hook return type for useChatMessages */
export interface ChatMessagesResult {
  messages: ParsedMessage[];
  isLoading: boolean;
  error: Error | null;
  /** Whether the chat file returned 404 (not configured yet) */
  notFound: boolean;
  /** Re-fetches the chat file (useful for retry after error) */
  retry: () => void;
}

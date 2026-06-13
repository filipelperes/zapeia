import { memo } from 'react';
import { renderMediaContent } from '@/utils/renderMediaContent';
import type { MessageType } from '@/features/chat/types';

interface MediaContentProps {
  type: MessageType;
  content: string;
  searchQuery?: string;
}

/** Renders WhatsApp media content: images, videos, audio, contacts, links, or formatted text */
export const MediaContent = memo(function MediaContent({ type, content, searchQuery }: MediaContentProps) {
  return <>{renderMediaContent(type, content, { highlightQuery: searchQuery })}</>;
});

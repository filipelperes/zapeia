import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { renderMediaContent } from '@/utils/renderMediaContent';
import type { MessageType } from '@/features/chat/types';

interface MediaContentProps {
  type: MessageType;
  content: string;
  searchQuery?: string;
}

/** Renders WhatsApp media content: images, videos, audio, contacts, links, or formatted text */
export const MediaContent = memo(function MediaContent({ type, content, searchQuery }: MediaContentProps) {
  const { t } = useTranslation();
  return <>{renderMediaContent(type, content, { highlightQuery: searchQuery, t })}</>;
});

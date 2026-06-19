import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { renderMediaContent } from '@/utils/renderMediaContent';

describe('renderMediaContent', () => {
   it('should render image for jpg files', () => {
      const result = renderMediaContent('media', 'IMG-20240819-WA0011.jpg') as React.ReactElement;
      const { container } = render(result);
      expect(container.querySelector('img')).not.toBeNull();
   });

   it('should render video for mp4 files', () => {
      const result = renderMediaContent('media', 'VID-20241108-WA0004.mp4') as React.ReactElement;
      const { container } = render(result);
      expect(container.querySelector('video')).not.toBeNull();
   });

   it('should render audio for opus files', () => {
      const result = renderMediaContent('media', 'PTT-20240819-WA0004.opus') as React.ReactElement;
      const { container } = render(result);
      expect(container.querySelector('audio')).not.toBeNull();
   });

   it('should render contact info for vcf files', () => {
      const result = renderMediaContent('media', 'contato.vcf') as React.ReactElement;
      render(result);
       expect(screen.getByText('Contact available:')).toBeDefined();
    });

    it('should show media omitted message', () => {
      const result = renderMediaContent('message', '<Media omitted>') as React.ReactElement;
      render(result);
      expect(screen.getByText('Media not exported or unavailable')).toBeDefined();
   });

   it('should format plain text messages', () => {
      const result = renderMediaContent('message', 'Hello world');
      expect(Array.isArray(result)).toBe(true);
   });

   it('should handle file attached type', () => {
      const result = renderMediaContent('media', 'doc.pdf (file attached)') as React.ReactElement;
      render(result);
      expect(screen.getByText('Download file')).toBeDefined();
   });

   it('should render download link for generic files', () => {
      const result = renderMediaContent('media', 'documento.pdf') as React.ReactElement;
      render(result);
      expect(screen.getByText('Download file')).toBeDefined();
   });

   it('should render png images', () => {
      const result = renderMediaContent('media', 'photo.png') as React.ReactElement;
      const { container } = render(result);
      expect(container.querySelector('img')).not.toBeNull();
   });

   it('should render webp images', () => {
      const result = renderMediaContent('media', 'sticker.webp') as React.ReactElement;
      const { container } = render(result);
      expect(container.querySelector('img')).not.toBeNull();
   });

   it('should render jpeg images', () => {
      const result = renderMediaContent('media', 'photo.jpeg') as React.ReactElement;
      const { container } = render(result);
      expect(container.querySelector('img')).not.toBeNull();
   });

   it('should render download link for unknown file types', () => {
      const result = renderMediaContent('media', 'unknown.xyz') as React.ReactElement;
      render(result);
      expect(screen.getByText('Download file')).toBeDefined();
   });

   it('should handle file attached with image extension', () => {
      const result = renderMediaContent('message', 'IMG-001.jpg (file attached)') as React.ReactElement;
      const { container } = render(result);
      expect(container.querySelector('img')).not.toBeNull();
   });

   it('should handle file attached with video extension', () => {
      const result = renderMediaContent('message', 'VID-001.mp4 (file attached)') as React.ReactElement;
      const { container } = render(result);
      expect(container.querySelector('video')).not.toBeNull();
   });

   it('should use custom baseUrl when provided', () => {
      const result = renderMediaContent('media', 'photo.jpg', { baseUrl: '/custom/' }) as React.ReactElement;
      const { container } = render(result);
      const img = container.querySelector('img');
      expect(img?.getAttribute('src')).toContain('/custom/media/photo.jpg');
   });

   it('should render audio with controls', () => {
      const result = renderMediaContent('media', 'audio.opus') as React.ReactElement;
      const { container } = render(result);
      const audio = container.querySelector('audio');
      expect(audio?.getAttribute('controls')).not.toBeNull();
   });

   // --- Deleted messages ---

   it('should render deleted message type', () => {
      const result = renderMediaContent('deleted', 'Some content') as React.ReactElement;
      render(result);
      expect(screen.getByText('Deleted message')).toBeDefined();
   });

   it('should render deleted message even with media filename', () => {
      const result = renderMediaContent('deleted', 'photo.jpg') as React.ReactElement;
      render(result);
      expect(screen.getByText('Deleted message')).toBeDefined();
   });

   // --- Unknown and edge case file types ---

   it('should render download link for gif files', () => {
      const result = renderMediaContent('media', 'animation.gif') as React.ReactElement;
      render(result);
      expect(screen.getByText('Download file')).toBeDefined();
   });

   it('should render download link for svg files', () => {
      const result = renderMediaContent('media', 'icon.svg') as React.ReactElement;
      render(result);
      expect(screen.getByText('Download file')).toBeDefined();
   });

   it('should render download link for mp3 files', () => {
      const result = renderMediaContent('media', 'audio.mp3') as React.ReactElement;
      render(result);
      expect(screen.getByText('Download file')).toBeDefined();
   });

   // --- Files with multiple dots ---

   it('should render image for file with multiple dots', () => {
      const result = renderMediaContent('media', 'archive.tar.gz') as React.ReactElement;
      render(result);
      // .gz is unknown → download link
      expect(screen.getByText('Download file')).toBeDefined();
   });

   it('should render image for jpg file with multiple dots in name', () => {
      const result = renderMediaContent('media', 'file.name.with.dots.jpg') as React.ReactElement;
      const { container } = render(result);
      expect(container.querySelector('img')).not.toBeNull();
   });

   // --- Edge case filenames ---

   it('should handle very long filename', () => {
      const longName = 'a'.repeat(200) + '.jpg';
      const result = renderMediaContent('media', longName) as React.ReactElement;
      const { container } = render(result);
      expect(container.querySelector('img')).not.toBeNull();
   });

   it('should handle filename with no extension (no dot)', () => {
      const result = renderMediaContent('media', 'README') as React.ReactElement;
      render(result);
      expect(screen.getByText('Download file')).toBeDefined();
   });

   it('should handle filename with leading dot', () => {
      const result = renderMediaContent('media', '.hidden') as React.ReactElement;
      render(result);
      expect(screen.getByText('Download file')).toBeDefined();
   });

   it('should handle filename with trailing dot', () => {
      const result = renderMediaContent('media', 'filename.') as React.ReactElement;
      render(result);
      expect(screen.getByText('Download file')).toBeDefined();
   });

   it('should handle short filename like a.jpg', () => {
      const result = renderMediaContent('media', 'a.jpg') as React.ReactElement;
      const { container } = render(result);
      expect(container.querySelector('img')).not.toBeNull();
   });

   // --- Uppercase extensions ---

   it('should render image for uppercase JPG extension', () => {
      const result = renderMediaContent('media', 'photo.JPG') as React.ReactElement;
      const { container } = render(result);
      expect(container.querySelector('img')).not.toBeNull();
   });

   it('should render video for uppercase MP4 extension', () => {
      const result = renderMediaContent('media', 'video.MP4') as React.ReactElement;
      const { container } = render(result);
      expect(container.querySelector('video')).not.toBeNull();
   });

   it('should render audio for uppercase OPUS extension', () => {
      const result = renderMediaContent('media', 'audio.OPUS') as React.ReactElement;
      const { container } = render(result);
      expect(container.querySelector('audio')).not.toBeNull();
   });

   // --- File attached with various extensions ---

   it('should handle file attached with opus audio', () => {
      const result = renderMediaContent('message', 'audio.opus (file attached)') as React.ReactElement;
      const { container } = render(result);
      expect(container.querySelector('audio')).not.toBeNull();
   });

   it('should handle file attached with vcf contact', () => {
      const result = renderMediaContent('message', 'contact.vcf (file attached)') as React.ReactElement;
      render(result);
      expect(screen.getByText('Contact available:')).toBeDefined();
   });

   // --- Type-specific media rendering ---

   it('should render image for type image without file attached', () => {
      const result = renderMediaContent('image', 'photo.jpg') as React.ReactElement;
      const { container } = render(result);
      expect(container.querySelector('img')).not.toBeNull();
   });

   it('should render video for type video without file attached', () => {
      const result = renderMediaContent('video', 'video.mp4') as React.ReactElement;
      const { container } = render(result);
      expect(container.querySelector('video')).not.toBeNull();
   });

   it('should render audio for type audio without file attached', () => {
      const result = renderMediaContent('audio', 'audio.opus') as React.ReactElement;
      const { container } = render(result);
      expect(container.querySelector('audio')).not.toBeNull();
   });

   // --- Options edge cases ---

   it('should use default baseUrl when options is empty object', () => {
      const result = renderMediaContent('media', 'photo.jpg', {}) as React.ReactElement;
      const { container } = render(result);
      const img = container.querySelector('img');
      // Should not crash and render an image
      expect(img).not.toBeNull();
   });

   it('should handle filename with spaces and parentheses', () => {
      const result = renderMediaContent('media', 'my photo (1).jpg') as React.ReactElement;
      const { container } = render(result);
      expect(container.querySelector('img')).not.toBeNull();
   });

   // --- Additional test cases ---

   it('should render download link for type contact with vcf', () => {
      const result = renderMediaContent('contact', 'contact.vcf') as React.ReactElement;
      render(result);
      expect(screen.getByText('Contact available:')).toBeDefined();
   });

   it('should render type generic content as formatted text', () => {
      const result = renderMediaContent('generic', 'file.xyz (file attached)') as React.ReactElement;
      render(result);
      expect(screen.getByText('Download file')).toBeDefined();
   });

   it('should handle deleted message with empty content', () => {
      const result = renderMediaContent('deleted', '') as React.ReactElement;
      render(result);
      expect(screen.getByText('Deleted message')).toBeDefined();
   });

   it('should handle type audio with ogg file', () => {
      const result = renderMediaContent('audio', 'sound.ogg') as React.ReactElement;
      render(result);
      expect(screen.getByText('Download file')).toBeDefined();
   });

   it('should handle type video with mov file', () => {
      const result = renderMediaContent('video', 'clip.mov') as React.ReactElement;
      render(result);
      expect(screen.getByText('Download file')).toBeDefined();
   });

   it('should render image for jpg with type image', () => {
      const result = renderMediaContent('image', 'photo.jpg') as React.ReactElement;
      const { container } = render(result);
      expect(container.querySelector('img')).not.toBeNull();
   });

   it('should render download link for type media with no extension', () => {
      const result = renderMediaContent('media', 'NOEXTENSION') as React.ReactElement;
      render(result);
      expect(screen.getByText('Download file')).toBeDefined();
   });

   it('should render formatted text for type message with special chars', () => {
      const result = renderMediaContent('message', 'Price is 50% off *now*');
      expect(Array.isArray(result)).toBe(true);
   });

    it('should render img with alt text "image"', () => {
      const result = renderMediaContent('media', 'photo.jpg') as React.ReactElement;
      render(result);
      const img = screen.getByAltText('image');
      expect(img).toBeDefined();
   });

   it('should render video with source type video/mp4', () => {
      const result = renderMediaContent('media', 'video.mp4') as React.ReactElement;
      const { container } = render(result);
      const source = container.querySelector('source');
      expect(source?.getAttribute('type')).toBe('video/mp4');
   });

   it('should render audio with source type audio/ogg', () => {
      const result = renderMediaContent('media', 'audio.opus') as React.ReactElement;
      const { container } = render(result);
      const source = container.querySelector('source');
      expect(source?.getAttribute('type')).toBe('audio/ogg');
   });

   it('should handle content with only spaces', () => {
      const result = renderMediaContent('message', '   ');
      expect(Array.isArray(result)).toBe(true);
   });
});

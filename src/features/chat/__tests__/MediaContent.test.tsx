import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MediaContent } from '@/features/chat/components/MediaContent';

describe('MediaContent', () => {
   it('should render text content for message type', () => {
      const { container } = render(<MediaContent type="message" content="Hello world" />);
      expect(container.textContent).toContain('Hello world');
   });

   it('should render bold formatted text', () => {
      const { container } = render(<MediaContent type="message" content="Hello *world*" />);
      expect(container.innerHTML).toContain('font-medium');
   });

   it('should render italic formatted text', () => {
      const { container } = render(<MediaContent type="message" content="Hello _world_" />);
      expect(container.innerHTML).toContain('italic');
   });

   it('should render links in text', () => {
      render(<MediaContent type="message" content="Visit https://example.com" />);
      const link = screen.getByText('https://example.com');
      expect(link).toBeDefined();
      expect(link.getAttribute('href')).toBe('https://example.com');
   });

   it('should render deleted message', () => {
      render(<MediaContent type="deleted" content="This message was deleted" />);
      expect(screen.getByText('Mensagem apagada')).toBeDefined();
   });

   it('should render media omitted', () => {
      render(<MediaContent type="media" content="<Media omitted>" />);
      expect(screen.getByText('Mídia não exportada ou indisponível')).toBeDefined();
   });

   it('should render image for jpg files', () => {
      const { container } = render(<MediaContent type="media" content="photo.jpg" />);
      expect(container.querySelector('img')).not.toBeNull();
   });

   it('should render download link for generic files', () => {
      render(<MediaContent type="media" content="document.pdf" />);
      expect(screen.getByText('Baixar arquivo')).toBeDefined();
   });

   it('should render audio for opus files', () => {
      const { container } = render(<MediaContent type="media" content="audio.opus" />);
      expect(container.querySelector('audio')).not.toBeNull();
   });

   it('should render video for mp4 files', () => {
      const { container } = render(<MediaContent type="media" content="video.mp4" />);
      expect(container.querySelector('video')).not.toBeNull();
   });

   it('should render contact info for vcf files', () => {
      render(<MediaContent type="media" content="contact.vcf" />);
      expect(screen.getByText('Contato disponível:')).toBeDefined();
   });

   it('should display formatted message with strikethrough', () => {
      const { container } = render(<MediaContent type="message" content="Hello ~world~" />);
      expect(container.innerHTML).toContain('line-through');
   });

   it('should handle image type directly', () => {
      const { container } = render(<MediaContent type="image" content="photo.jpg" />);
      expect(container.querySelector('img')).not.toBeNull();
   });

   it('should render png image with img tag', () => {
      const { container } = render(<MediaContent type="media" content="photo.png" />);
      expect(container.querySelector('img')).not.toBeNull();
   });

   it('should render webp image with img tag', () => {
      const { container } = render(<MediaContent type="media" content="photo.webp" />);
      expect(container.querySelector('img')).not.toBeNull();
   });

   it('should render jpeg image with img tag', () => {
      const { container } = render(<MediaContent type="media" content="photo.jpeg" />);
      expect(container.querySelector('img')).not.toBeNull();
   });

   it('should render download link for unknown file extension', () => {
      render(<MediaContent type="media" content="file.xyz" />);
      expect(screen.getByText('Baixar arquivo')).toBeDefined();
   });

   it('should handle file attached suffix with image', () => {
      const { container } = render(<MediaContent type="media" content="photo.jpg (file attached)" />);
      expect(container.querySelector('img')).not.toBeNull();
   });

   it('should handle file attached suffix with video', () => {
      const { container } = render(<MediaContent type="media" content="video.mp4 (file attached)" />);
      expect(container.querySelector('video')).not.toBeNull();
   });

   it('should handle file attached suffix with unknown type', () => {
      render(<MediaContent type="media" content="file.xyz (file attached)" />);
      expect(screen.getByText('Baixar arquivo')).toBeDefined();
   });

   it('should render audio element with controls attribute', () => {
      const { container } = render(<MediaContent type="media" content="audio.opus" />);
      const audio = container.querySelector('audio');
      expect(audio).not.toBeNull();
      expect(audio?.getAttribute('controls')).not.toBeNull();
   });

   it('should render video element with controls attribute', () => {
      const { container } = render(<MediaContent type="media" content="video.mp4" />);
      const video = container.querySelector('video');
      expect(video).not.toBeNull();
      expect(video?.getAttribute('controls')).not.toBeNull();
   });

   it('should render text with multiple URLs', () => {
      render(<MediaContent type="message" content="Visit https://a.com and https://b.com" />);
      expect(screen.getByText('https://a.com')).toBeDefined();
      expect(screen.getByText('https://b.com')).toBeDefined();
   });

   it('should render text with mixed formatting and URLs', () => {
      const { container } = render(<MediaContent type="message" content="*Bold* https://example.com _italic_" />);
      expect(container.innerHTML).toContain('font-medium');
      expect(container.innerHTML).toContain('italic');
      expect(screen.getByText('https://example.com')).toBeDefined();
   });

   it('should render system type content as plain text', () => {
      const { container } = render(<MediaContent type="system" content="Group created" />);
      expect(container.textContent).toContain('Group created');
   });

   it('should handle video type directly', () => {
      const { container } = render(<MediaContent type="video" content="clip.mp4" />);
      expect(container.querySelector('video')).not.toBeNull();
   });

   it('should handle audio type directly', () => {
      const { container } = render(<MediaContent type="audio" content="sound.opus" />);
      expect(container.querySelector('audio')).not.toBeNull();
   });

   it('should render no content for empty message type', () => {
      const { container } = render(<MediaContent type="message" content="" />);
      // Should render empty fragment without crashing
      expect(container.textContent).toBe('');
   });

   it('should render deleted message with empty content string', () => {
      render(<MediaContent type="deleted" content="" />);
      expect(screen.getByText('Mensagem apagada')).toBeDefined();
   });

   it('should render contact type with vcf file', () => {
      render(<MediaContent type="contact" content="contact.vcf" />);
      expect(screen.getByText('Contato disponível:')).toBeDefined();
   });

   it('should render download link for media type with file attached', () => {
      render(<MediaContent type="media" content="file.xyz (file attached)" />);
      expect(screen.getByText('Baixar arquivo')).toBeDefined();
   });

   it('should render system type content as formatted text', () => {
      const { container } = render(<MediaContent type="system" content="System *message*" />);
      expect(container.textContent).toContain('System');
   });

   it('should render message type with URL link', () => {
      render(<MediaContent type="message" content="Visit https://example.com/path" />);
      const link = screen.getByText('https://example.com/path');
      expect(link).toBeDefined();
      expect(link.getAttribute('href')).toBe('https://example.com/path');
   });

   it('should render message with numeric content', () => {
      const { container } = render(<MediaContent type="message" content="42" />);
      expect(container.textContent).toContain('42');
   });

   it('should render message with special characters content', () => {
      const { container } = render(<MediaContent type="message" content="!@#$%^&*()" />);
      expect(container.textContent).toContain('!@#$%^&*()');
   });

   it('should render bold, italic, and URL in same message', () => {
      const { container } = render(<MediaContent type="message" content="*Bold* https://example.com _italic_" />);
      expect(container.innerHTML).toContain('font-medium');
      expect(container.innerHTML).toContain('italic');
      expect(screen.getByText('https://example.com')).toBeDefined();
   });

   it('should render message with code formatting', () => {
      const { container } = render(<MediaContent type="message" content="Use `const x = 1`" />);
      expect(container.querySelector('code')).not.toBeNull();
   });

   it('should render image with img element for png', () => {
      const { container } = render(<MediaContent type="media" content="image.png" />);
      expect(container.querySelector('img')).not.toBeNull();
   });

   it('should render strikethrough for deleted type message', () => {
      render(<MediaContent type="deleted" content="This message was deleted" />);
      const el = screen.getByText('Mensagem apagada');
      expect(el.className).toContain('line-through');
   });
});

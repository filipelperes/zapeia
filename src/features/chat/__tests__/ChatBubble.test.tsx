import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChatBubble } from '@/features/chat/components/ChatBubble';
import type { ParsedMessage } from '@/features/chat/types';

describe('ChatBubble', () => {
   const textMessage: ParsedMessage = {
      date: '19/08/24',
      time: '09:28',
      sender: 'Felipe',
      content: 'Bom dia a todos',
      type: 'message',
   };

   const systemMessage: ParsedMessage = {
      date: '17/08/24',
      time: '12:32',
      sender: 'system',
      content: 'Messages and calls are end-to-end encrypted.',
      type: 'system',
   };

   const deletedMessage: ParsedMessage = {
      date: '19/08/24',
      time: '09:30',
      sender: 'João',
      content: 'This message was deleted',
      type: 'deleted',
   };

   const mediaMessage: ParsedMessage = {
      date: '19/08/24',
      time: '10:00',
      sender: 'Maria',
      content: 'photo.jpg',
      type: 'image',
   };

   it('should render sender name for user messages', () => {
      render(<ChatBubble message={textMessage} />);
      expect(screen.getByText('Felipe')).toBeDefined();
   });

   it('should render message content for text messages', () => {
      render(<ChatBubble message={textMessage} />);
      expect(screen.getByText('Bom dia a todos')).toBeDefined();
   });

   it('should render system messages differently', () => {
      render(<ChatBubble message={systemMessage} />);
      const el = screen.getByText('Messages and calls are end-to-end encrypted.');
      expect(el).toBeDefined();
      expect(el.className).toContain('text-center');
   });

   it('should show "Mensagem apagada" for deleted messages', () => {
      render(<ChatBubble message={deletedMessage} />);
      expect(screen.getByText('Mensagem apagada')).toBeDefined();
   });

   it('should not render sender for system messages', () => {
      const { container } = render(<ChatBubble message={systemMessage} />);
      const senderElements = container.querySelectorAll('.text-\\[\\#06CF9C\\]');
      expect(senderElements.length).toBe(0);
   });

   it('should render sender in green color', () => {
      render(<ChatBubble message={textMessage} />);
      const sender = screen.getByText('Felipe');
      expect(sender.className).toContain('text-[#06CF9C]');
   });

   it('should render media messages as images', () => {
      const { container } = render(<ChatBubble message={mediaMessage} />);
      expect(container.querySelector('img')).not.toBeNull();
   });

   it('should render timestamp for messages', () => {
      const { container } = render(<ChatBubble message={textMessage} />);
      const timeElements = container.querySelectorAll('.text-\\[11px\\]');
      expect(timeElements.length).toBeGreaterThan(0);
   });

   it('should render message in white bubble', () => {
      const { container } = render(<ChatBubble message={textMessage} />);
      const bubble = container.querySelector('.bg-white');
      expect(bubble).not.toBeNull();
   });

   it('should handle message with formatted text', () => {
      const formatted: ParsedMessage = {
         ...textMessage,
         content: 'Hello *bold* and _italic_',
      };
      render(<ChatBubble message={formatted} />);
      const contentEl = screen.getByText(/Hello/);
      expect(contentEl).toBeDefined();
   });

   it('should handle audio media type', () => {
      const audioMsg: ParsedMessage = {
         date: '19/08/24',
         time: '11:00',
         sender: 'João',
         content: 'audio.opus',
         type: 'audio',
      };
      const { container } = render(<ChatBubble message={audioMsg} />);
      expect(container.querySelector('audio')).not.toBeNull();
   });

   it('should handle You deleted this message', () => {
      const youDeleted: ParsedMessage = {
         date: '19/08/24',
         time: '11:00',
         sender: 'Felipe',
         content: 'You deleted this message',
         type: 'deleted',
      };
      render(<ChatBubble message={youDeleted} />);
      expect(screen.getByText('Mensagem apagada')).toBeDefined();
   });

   it('should handle media omitted content', () => {
      const mediaOmitted: ParsedMessage = {
         date: '19/08/24',
         time: '11:00',
         sender: 'João',
         content: '<Media omitted>',
         type: 'media',
      };
      render(<ChatBubble message={mediaOmitted} />);
      expect(screen.getByText('Mídia não exportada ou indisponível')).toBeDefined();
   });

   it('should have rounded corners on bubble', () => {
      const { container } = render(<ChatBubble message={textMessage} />);
      const bubble = container.querySelector('.rounded-lg');
      expect(bubble).not.toBeNull();
   });

   it('should handle message with URL', () => {
      const urlMsg: ParsedMessage = {
         ...textMessage,
         content: 'Check https://example.com',
      };
      render(<ChatBubble message={urlMsg} />);
      const link = screen.getByText('https://example.com');
      expect(link.getAttribute('href')).toBe('https://example.com');
   });

   it('should handle video media type via ChatBubble', () => {
      const videoMsg: ParsedMessage = {
         date: '19/08/24', time: '11:00', sender: 'João',
         content: 'video.mp4', type: 'video',
      };
      const { container } = render(<ChatBubble message={videoMsg} />);
      expect(container.querySelector('video')).not.toBeNull();
   });

   it('should handle contact vcf type via ChatBubble', () => {
      const contactMsg: ParsedMessage = {
         date: '19/08/24', time: '11:00', sender: 'Maria',
         content: 'contato.vcf', type: 'contact',
      };
      render(<ChatBubble message={contactMsg} />);
      expect(screen.getByText('Contato disponível:')).toBeDefined();
   });

   it('should handle generic file type via ChatBubble', () => {
      // 'generic' type with (file attached) suffix triggers download link
      const fileMsg: ParsedMessage = {
         date: '19/08/24', time: '11:00', sender: 'João',
         content: 'documento.pdf (file attached)',
         type: 'generic',
      };
      render(<ChatBubble message={fileMsg} />);
      expect(screen.getByText('Baixar arquivo')).toBeDefined();
   });

   it('should handle message with very long content', () => {
      const longContent = 'A'.repeat(500);
      const longMsg: ParsedMessage = { ...textMessage, content: longContent };
      const { container } = render(<ChatBubble message={longMsg} />);
      expect(container.textContent).toContain(longContent);
   });

   it('should handle message with only emoji content', () => {
      const emojiMsg: ParsedMessage = { ...textMessage, content: '😊🎉🚀❤️👍' };
      render(<ChatBubble message={emojiMsg} />);
      expect(screen.getByText('😊🎉🚀❤️👍')).toBeDefined();
   });

   it('should handle message with strikethrough formatting', () => {
      const strikeMsg: ParsedMessage = { ...textMessage, content: 'Hello ~world~' };
      const { container } = render(<ChatBubble message={strikeMsg} />);
      expect(container.innerHTML).toContain('line-through');
   });

   it('should handle multiline message content', () => {
      const multiMsg: ParsedMessage = { ...textMessage, content: 'Line 1\nLine 2\nLine 3' };
      render(<ChatBubble message={multiMsg} />);
      expect(screen.getByText(/Line 1/)).toBeDefined();
   });

   it('should render message with bold and italic combined', () => {
      const comboMsg: ParsedMessage = { ...textMessage, content: '*bold* and _italic_' };
      const { container } = render(<ChatBubble message={comboMsg} />);
      expect(container.innerHTML).toContain('font-medium');
      expect(container.innerHTML).toContain('italic');
   });

   it('should have shadow-sm class on the bubble', () => {
      const { container } = render(<ChatBubble message={textMessage} />);
      const bubble = container.querySelector('.shadow-sm');
      expect(bubble).not.toBeNull();
   });

   it('should have max-w-[85%] class on the bubble', () => {
      const { container } = render(<ChatBubble message={textMessage} />);
      const bubble = container.querySelector('.max-w-\\[85\\%\\]');
      expect(bubble).not.toBeNull();
   });

   it('should handle sender name with special characters', () => {
      const specialSender: ParsedMessage = {
         ...textMessage, sender: 'Felipe@Work (dev)',
      };
      render(<ChatBubble message={specialSender} />);
      expect(screen.getByText('Felipe@Work (dev)')).toBeDefined();
   });

   it('should handle message with only whitespace content', () => {
      const wsMsg: ParsedMessage = { ...textMessage, content: '   ' };
      const { container } = render(<ChatBubble message={wsMsg} />);
      expect(container.querySelector('.leading-relaxed')).not.toBeNull();
   });

   it('should handle message with code backticks', () => {
      const codeMsg: ParsedMessage = { ...textMessage, content: 'Use `const x = 1`' };
      const { container } = render(<ChatBubble message={codeMsg} />);
      expect(container.querySelector('code')).not.toBeNull();
   });

   it('should handle multiple URLs in message', () => {
      const multiUrlMsg: ParsedMessage = {
         ...textMessage, content: 'See https://a.com and https://b.com',
      };
      render(<ChatBubble message={multiUrlMsg} />);
      expect(screen.getByText('https://a.com')).toBeDefined();
      expect(screen.getByText('https://b.com')).toBeDefined();
   });

   it('should handle document with file attached type', () => {
      const docMsg: ParsedMessage = {
         date: '19/08/24', time: '11:00', sender: 'João',
         content: 'report.pdf (file attached)',
         type: 'media',
      };
      render(<ChatBubble message={docMsg} />);
      expect(screen.getByText('Baixar arquivo')).toBeDefined();
   });

   it('should handle video mp4 with file attached', () => {
      const videoAttachedMsg: ParsedMessage = {
         date: '19/08/24', time: '11:00', sender: 'Maria',
         content: 'video.mp4 (file attached)',
         type: 'media',
      };
      const { container } = render(<ChatBubble message={videoAttachedMsg} />);
      expect(container.querySelector('video')).not.toBeNull();
   });

   it('should have flex-col layout on bubble container', () => {
      const { container } = render(<ChatBubble message={textMessage} />);
      const outerDiv = container.querySelector('.flex-col');
      expect(outerDiv).not.toBeNull();
   });

   it('should handle message when content is just a number', () => {
      const numMsg: ParsedMessage = { ...textMessage, content: '42' };
      render(<ChatBubble message={numMsg} />);
      expect(screen.getByText('42')).toBeDefined();
   });

   it('should handle message with mixed URL and formatted text', () => {
      const mixedMsg: ParsedMessage = {
         ...textMessage, content: '*Check* https://example.com for _details_',
      };
      const { container } = render(<ChatBubble message={mixedMsg} />);
      expect(container.innerHTML).toContain('font-medium');
      expect(container.innerHTML).toContain('italic');
      expect(screen.getByText('https://example.com')).toBeDefined();
   });

   it('should handle media type with image directly', () => {
      const directImg: ParsedMessage = {
         date: '19/08/24', time: '10:00', sender: 'Pedro',
         content: 'foto.png', type: 'image',
      };
      const { container } = render(<ChatBubble message={directImg} />);
      expect(container.querySelector('img')).not.toBeNull();
   });

   it('should render message time with formatted date', () => {
      const { container } = render(<ChatBubble message={textMessage} />);
      const timeEl = container.querySelector('.text-\\[11px\\]');
      expect(timeEl).not.toBeNull();
      expect(timeEl?.textContent).toBeTruthy();
   });

   it('should render bubble with proper width constraint', () => {
      const { container } = render(<ChatBubble message={textMessage} />);
      const bubble = container.querySelector('.max-w-\\[85\\%\\]');
      expect(bubble).not.toBeNull();
   });

   it('should handle sender name with only numbers', () => {
      const numSender: ParsedMessage = {
         ...textMessage, sender: '+55 11 99999-8888',
      };
      render(<ChatBubble message={numSender} />);
      expect(screen.getByText('+55 11 99999-8888')).toBeDefined();
   });

   it('should handle message with HTML entities in text', () => {
      const htmlMsg: ParsedMessage = {
         ...textMessage, content: 'Price &lt; 10 &gt; 5 &amp; more',
      };
      const { container } = render(<ChatBubble message={htmlMsg} />);
      expect(container.textContent).toContain('Price');
   });

   it('should handle message with multiple newlines', () => {
      const multiNewline: ParsedMessage = {
         ...textMessage, content: 'Line 1\n\n\nLine 4',
      };
      render(<ChatBubble message={multiNewline} />);
      expect(screen.getByText(/Line 1/)).toBeDefined();
   });

   it('should handle sender name with emoji only', () => {
      const emojiSender: ParsedMessage = {
         ...textMessage, sender: '😀',
      };
      render(<ChatBubble message={emojiSender} />);
      expect(screen.getByText('😀')).toBeDefined();
   });

   it('should handle message with file path as content', () => {
      const pathMsg: ParsedMessage = {
         ...textMessage, content: '/path/to/some/file.pdf',
      };
      render(<ChatBubble message={pathMsg} />);
      expect(screen.getByText('/path/to/some/file.pdf')).toBeDefined();
   });

   it('should render image with alt attribute', () => {
      const imgMsg: ParsedMessage = {
         date: '19/08/24', time: '10:00', sender: 'João',
         content: 'photo.jpg', type: 'image',
      };
      render(<ChatBubble message={imgMsg} />);
      const img = screen.getByAltText('imagem');
      expect(img).toBeDefined();
   });

   it('should handle message with Portuguese special characters', () => {
      const ptMsg: ParsedMessage = {
         ...textMessage, content: 'Você já chegou? Não, ainda não!',
      };
      render(<ChatBubble message={ptMsg} />);
      expect(screen.getByText('Você já chegou? Não, ainda não!')).toBeDefined();
   });

   describe('myName alignment', () => {
      const ownMessage: ParsedMessage = {
         date: '19/08/24', time: '10:00',
         sender: 'Felipe', content: 'Oi pessoal', type: 'message',
      };

      it('should align right and hide sender when myName matches sender', () => {
         const { container } = render(<ChatBubble message={ownMessage} myName="Felipe" />);
         const bubble = container.querySelector('.chat-bubble-own');
         expect(bubble).not.toBeNull();
         expect(screen.queryByText('Felipe')).toBeNull();
      });

      it('should align left and show sender when myName does not match', () => {
         const { container } = render(<ChatBubble message={ownMessage} myName="Maria" />);
         const bubble = container.querySelector('.chat-bubble');
         expect(bubble).not.toBeNull();
         expect(screen.getByText('Felipe')).toBeDefined();
      });

      it('should align left when myName is empty string', () => {
         const { container } = render(<ChatBubble message={ownMessage} myName="" />);
         const bubble = container.querySelector('.chat-bubble');
         expect(bubble).not.toBeNull();
      });

      it('should match sender case-insensitively', () => {
         const { container } = render(<ChatBubble message={ownMessage} myName="felipe" />);
         expect(container.querySelector('.chat-bubble-own')).not.toBeNull();
      });
   });

   describe('edited indicator', () => {
      it('should show "Editada" text when message is edited', () => {
         const editedMsg: ParsedMessage = {
            ...textMessage, edited: true,
         };
         render(<ChatBubble message={editedMsg} />);
         expect(screen.getByText('Editada')).toBeDefined();
      });

      it('should not show "Editada" text when message is not edited', () => {
         render(<ChatBubble message={textMessage} />);
         expect(screen.queryByText('Editada')).toBeNull();
      });
   });
});

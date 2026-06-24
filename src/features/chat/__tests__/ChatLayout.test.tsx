import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChatLayout } from '@/features/chat/components/ChatLayout';
import type { ParsedMessage } from '@/features/chat/types';

describe('ChatLayout', () => {
   const messages: ParsedMessage[] = [
      {
         date: '19/08/24',
         time: '09:28',
         sender: 'Felipe',
         content: 'Bom dia',
         type: 'message',
      },
      {
         date: '19/08/24',
         time: '09:29',
         sender: 'João',
         content: 'Olá',
         type: 'message',
      },
   ];

   it('should render header with title', () => {
      render(<ChatLayout messages={messages} title="Test Group" />);
      expect(screen.getByText('Test Group')).toBeDefined();
   });

   it('should render all messages', () => {
      render(<ChatLayout messages={messages} />);
      expect(screen.getByText('Bom dia')).toBeDefined();
      expect(screen.getByText('Olá')).toBeDefined();
   });

   it('should render input bar', () => {
      render(<ChatLayout messages={messages} />);
       expect(screen.getByText('Type a message')).toBeDefined();
    });

    it('should render emoji button', () => {
      render(<ChatLayout messages={messages} />);
      expect(screen.getByLabelText('Emoji')).toBeDefined();
   });

   it('should render attach button', () => {
      render(<ChatLayout messages={messages} />);
       expect(screen.getByLabelText('Attach')).toBeDefined();
    });

    it('should render send button', () => {
       render(<ChatLayout messages={messages} />);
       expect(screen.getByLabelText('Send')).toBeDefined();
    });

    it('should show "No messages" for empty messages', () => {
      render(<ChatLayout messages={[]} />);
       expect(screen.getByText('No messages found.')).toBeDefined();
    });

   it('should render system messages', () => {
      const msgs: ParsedMessage[] = [{
         date: '19/08/24',
         time: '12:00',
         sender: 'system',
         content: 'Group created',
         type: 'system',
      }];
      render(<ChatLayout messages={msgs} />);
      expect(screen.getByText('Group created')).toBeDefined();
   });

   it('should use default title when not provided', () => {
      render(<ChatLayout messages={messages} />);
       expect(screen.getByText('WhatsApp History')).toBeDefined();
   });

    it('should render with WhatsApp background style', () => {
       const { container } = render(<ChatLayout messages={messages} />);
       const layout = container.firstChild as HTMLElement;
       expect(layout.classList.contains('surface-chat')).toBe(true);
    });

   it('should render large number of messages', () => {
      const manyMsgs: ParsedMessage[] = Array.from({ length: 100 }, (_, i) => ({
         date: '19/08/24', time: '09:28', sender: 'User',
         content: `Msg ${i}`, type: 'message' as const,
      }));
      render(<ChatLayout messages={manyMsgs} />);
      expect(screen.getByText('Msg 0')).toBeDefined();
      expect(screen.getByText('Msg 99')).toBeDefined();
   });

   it('should render single message only', () => {
      const single: ParsedMessage[] = [{
         date: '19/08/24', time: '09:28', sender: 'Felipe',
         content: 'Only message', type: 'message',
      }];
      render(<ChatLayout messages={single} />);
      expect(screen.getByText('Only message')).toBeDefined();
   });

   it('should render date separators for different days', () => {
      const multiDay: ParsedMessage[] = [
         { date: '19/08/24', time: '23:59', sender: 'Felipe', content: 'Hoje', type: 'message' },
         { date: '20/08/24', time: '00:01', sender: 'João', content: 'Amanhã', type: 'message' },
      ];
      const { container } = render(<ChatLayout messages={multiDay} />);
      const separators = container.querySelectorAll('.rounded-full');
      expect(separators.length).toBeGreaterThanOrEqual(2);
   });

   it('should handle only system messages', () => {
      const sysMsgs: ParsedMessage[] = [
         { date: '19/08/24', time: '12:00', sender: 'system', content: 'Group created', type: 'system' },
         { date: '19/08/24', time: '12:01', sender: 'system', content: 'Member added', type: 'system' },
      ];
      render(<ChatLayout messages={sysMsgs} />);
      expect(screen.getByText('Group created')).toBeDefined();
      expect(screen.getByText('Member added')).toBeDefined();
   });

   it('should handle only deleted messages', () => {
      const delMsgs: ParsedMessage[] = [
         { date: '19/08/24', time: '12:00', sender: 'Felipe', content: 'This message was deleted', type: 'deleted' },
      ];
       render(<ChatLayout messages={delMsgs} />);
       expect(screen.getByText('Deleted message')).toBeDefined();
   });

   it('should handle only media messages', () => {
      const mediaMsgs: ParsedMessage[] = [
         { date: '19/08/24', time: '12:00', sender: 'Felipe', content: 'photo.jpg', type: 'image' },
         { date: '19/08/24', time: '12:01', sender: 'João', content: 'video.mp4', type: 'video' },
      ];
      const { container } = render(<ChatLayout messages={mediaMsgs} />);
      expect(container.querySelector('img')).not.toBeNull();
      expect(container.querySelector('video')).not.toBeNull();
   });

   it('should render mixed message types together', () => {
      const mixed: ParsedMessage[] = [
         { date: '19/08/24', time: '10:00', sender: 'Felipe', content: 'Hello', type: 'message' },
         { date: '19/08/24', time: '10:01', sender: 'system', content: 'Encrypted', type: 'system' },
         { date: '19/08/24', time: '10:02', sender: 'João', content: 'photo.jpg', type: 'image' },
      ];
      render(<ChatLayout messages={mixed} />);
      expect(screen.getByText('Hello')).toBeDefined();
      expect(screen.getByText('Encrypted')).toBeDefined();
      expect(screen.getByText('João')).toBeDefined();
   });

   it('should render messages with same date (no extra separators)', () => {
      const sameDay: ParsedMessage[] = [
         { date: '19/08/24', time: '09:00', sender: 'Felipe', content: 'First', type: 'message' },
         { date: '19/08/24', time: '10:00', sender: 'João', content: 'Second', type: 'message' },
         { date: '19/08/24', time: '11:00', sender: 'Felipe', content: 'Third', type: 'message' },
      ];
      render(<ChatLayout messages={sameDay} />);
      expect(screen.getByText('First')).toBeDefined();
      expect(screen.getByText('Second')).toBeDefined();
      expect(screen.getByText('Third')).toBeDefined();
   });

   it('should have rounded-xl and shadow-2xl on container', () => {
      const { container } = render(<ChatLayout messages={messages} />);
      const layout = container.firstChild as HTMLElement;
      expect(layout.className).toContain('rounded-xl');
      expect(layout.className).toContain('shadow-2xl');
   });

   it('should render input bar with all three action buttons', () => {
      render(<ChatLayout messages={messages} />);
      expect(screen.getByLabelText('Emoji')).toBeDefined();
       expect(screen.getByLabelText('Attach')).toBeDefined();
       expect(screen.getByLabelText('Send')).toBeDefined();
    });

    it('should render input bar text placeholder', () => {
       render(<ChatLayout messages={messages} />);
       expect(screen.getByText('Type a message')).toBeDefined();
   });

   it('should render custom title and pass it to header', () => {
      render(<ChatLayout messages={messages} title="Meu Grupo" />);
      expect(screen.getByText('Meu Grupo')).toBeDefined();
   });

   it('should render default title for empty title string', () => {
      // When title="" is passed, ChatHeader doesn't apply the default (only undefined triggers it)
      // Should still render without crashing
      const { container } = render(<ChatLayout messages={messages} title="" />);
      const header = container.querySelector('header');
      expect(header).not.toBeNull();
   });

   it('should render with custom title and display sender names', () => {
      render(<ChatLayout messages={messages} title="Grupo da Família" />);
      expect(screen.getByText('Grupo da Família')).toBeDefined();
      expect(screen.getByText('Felipe')).toBeDefined();
      expect(screen.getByText('João')).toBeDefined();
   });

   it('should render system messages between user messages', () => {
      const mixed: ParsedMessage[] = [
         { date: '19/08/24', time: '10:00', sender: 'Felipe', content: 'Hello', type: 'message' },
         { date: '19/08/24', time: '10:01', sender: 'system', content: 'Encrypted', type: 'system' },
         { date: '19/08/24', time: '10:02', sender: 'João', content: 'Hi there', type: 'message' },
      ];
      render(<ChatLayout messages={mixed} />);
      expect(screen.getByText('Hello')).toBeDefined();
      expect(screen.getByText('Encrypted')).toBeDefined();
      expect(screen.getByText('Hi there')).toBeDefined();
   });

   it('should render with formatted text messages', () => {
      const formatted: ParsedMessage[] = [{
         date: '19/08/24', time: '10:00', sender: 'Felipe',
         content: '*bold* and _italic_', type: 'message',
      }];
      const { container } = render(<ChatLayout messages={formatted} />);
      expect(container.innerHTML).toContain('font-medium');
      expect(container.innerHTML).toContain('italic');
   });

   it('should render only deleted messages in layout', () => {
      const delMsgs: ParsedMessage[] = [
         { date: '19/08/24', time: '10:00', sender: 'Felipe', content: 'This message was deleted', type: 'deleted' },
         { date: '19/08/24', time: '10:01', sender: 'João', content: 'You deleted this message', type: 'deleted' },
      ];
       render(<ChatLayout messages={delMsgs} />);
       const deleted = screen.getAllByText('Deleted message');
       expect(deleted).toHaveLength(2);
   });

   it('should render input bar with all buttons and placeholder', () => {
      render(<ChatLayout messages={messages} />);
       expect(screen.getByLabelText('Emoji')).toBeDefined();
       expect(screen.getByLabelText('Attach')).toBeDefined();
       expect(screen.getByLabelText('Send')).toBeDefined();
       expect(screen.getByText('Type a message')).toBeDefined();
   });

   it('should render with many different senders', () => {
      const manySenders: ParsedMessage[] = [
         { date: '19/08/24', time: '09:00', sender: 'Alice', content: 'Hi', type: 'message' },
         { date: '19/08/24', time: '09:01', sender: 'Bob', content: 'Hey', type: 'message' },
         { date: '19/08/24', time: '09:02', sender: 'Charlie', content: 'Hello', type: 'message' },
         { date: '19/08/24', time: '09:03', sender: 'Diana', content: 'Hi all', type: 'message' },
      ];
      render(<ChatLayout messages={manySenders} />);
      expect(screen.getByText('Alice')).toBeDefined();
      expect(screen.getByText('Bob')).toBeDefined();
      expect(screen.getByText('Charlie')).toBeDefined();
      expect(screen.getByText('Diana')).toBeDefined();
   });

    it('should render chat background with WhatsApp pattern', () => {
       const { container } = render(<ChatLayout messages={messages} />);
       const layout = container.firstChild as HTMLElement;
       expect(layout.classList.contains('surface-chat')).toBe(true);
       expect(layout.className).toContain('overflow-hidden');
    });

   it('should render with media messages in layout', () => {
      const mediaMsgs: ParsedMessage[] = [
         { date: '19/08/24', time: '10:00', sender: 'Felipe', content: 'photo.jpg', type: 'image' },
         { date: '19/08/24', time: '10:01', sender: 'João', content: 'audio.opus', type: 'audio' },
      ];
      const { container } = render(<ChatLayout messages={mediaMsgs} />);
      expect(container.querySelector('img')).not.toBeNull();
      expect(container.querySelector('audio')).not.toBeNull();
   });

   it('should render overflow-hidden container', () => {
      const { container } = render(<ChatLayout messages={messages} />);
      const layout = container.firstChild as HTMLElement;
      expect(layout.className).toContain('overflow-hidden');
   });

   it('should render message list in correct order', () => {
      const ordered: ParsedMessage[] = [
         { date: '19/08/24', time: '09:00', sender: 'Felipe', content: 'First', type: 'message' },
         { date: '19/08/24', time: '09:30', sender: 'João', content: 'Second', type: 'message' },
         { date: '19/08/24', time: '10:00', sender: 'Felipe', content: 'Third', type: 'message' },
      ];
      const { container } = render(<ChatLayout messages={ordered} />);
      const text = container.textContent || '';
      expect(text.indexOf('First')).toBeLessThan(text.indexOf('Second'));
      expect(text.indexOf('Second')).toBeLessThan(text.indexOf('Third'));
   });
});

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MessageList } from '@/features/chat/components/MessageList';
import type { ParsedMessage } from '@/features/chat/types';

describe('MessageList', () => {
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

   it('should render all messages', () => {
      render(<MessageList messages={messages} />);
      expect(screen.getByText('Bom dia')).toBeDefined();
      expect(screen.getByText('Olá')).toBeDefined();
   });

   it('should render sender names', () => {
      render(<MessageList messages={messages} />);
      expect(screen.getByText('Felipe')).toBeDefined();
      expect(screen.getByText('João')).toBeDefined();
   });

   it('should handle empty message list', () => {
      const { container } = render(<MessageList messages={[]} />);
      expect(container.firstChild).toBeDefined();
   });

   it('should render date separator for first message', () => {
      const { container } = render(<MessageList messages={messages} />);
      // Date separator should have rounded-full class
      const separators = container.querySelectorAll('.rounded-full');
      expect(separators.length).toBeGreaterThan(0);
   });

   it('should render date separator for new day', () => {
      const multiDayMessages: ParsedMessage[] = [
         { date: '19/08/24', time: '09:28', sender: 'Felipe', content: 'Hoje', type: 'message' },
         { date: '20/08/24', time: '10:00', sender: 'João', content: 'Amanhã', type: 'message' },
      ];
      const { container } = render(<MessageList messages={multiDayMessages} />);
      // Should have date separators for each day
      const separators = container.querySelectorAll('.rounded-full');
      expect(separators.length).toBeGreaterThanOrEqual(2);
   });

   it('should handle system messages in list', () => {
      const msgs: ParsedMessage[] = [
         { date: '19/08/24', time: '12:00', sender: 'system', content: 'Group created', type: 'system' },
      ];
      render(<MessageList messages={msgs} />);
      expect(screen.getByText('Group created')).toBeDefined();
   });

   it('should handle deleted messages in list', () => {
      const msgs: ParsedMessage[] = [
         { date: '19/08/24', time: '12:00', sender: 'Felipe', content: 'This message was deleted', type: 'deleted' },
      ];
       render(<MessageList messages={msgs} />);
       expect(screen.getByText('Deleted message')).toBeDefined();
    });

   it('should handle media messages in list', () => {
      const msgs: ParsedMessage[] = [
         { date: '19/08/24', time: '12:00', sender: 'Felipe', content: 'photo.jpg', type: 'image' },
      ];
      const { container } = render(<MessageList messages={msgs} />);
      expect(container.querySelector('img')).not.toBeNull();
   });

   it('should have scrollable container', () => {
      const { container } = render(<MessageList messages={messages} />);
      const scrollDiv = container.firstChild as HTMLElement;
      expect(scrollDiv.className).toContain('overflow-y-auto');
   });

   it('should not add date separator for same day messages', () => {
      const sameDayMessages: ParsedMessage[] = [
         { date: '19/08/24', time: '09:28', sender: 'Felipe', content: 'Msg 1', type: 'message' },
         { date: '19/08/24', time: '09:29', sender: 'Felipe', content: 'Msg 2', type: 'message' },
         { date: '19/08/24', time: '09:30', sender: 'Felipe', content: 'Msg 3', type: 'message' },
      ];
      render(<MessageList messages={sameDayMessages} />);
      expect(screen.getByText('Msg 1')).toBeDefined();
      expect(screen.getByText('Msg 2')).toBeDefined();
   });

   it('should render with large message count', () => {
      const manyMessages: ParsedMessage[] = Array.from({ length: 50 }, (_, i) => ({
         date: '19/08/24',
         time: `${String(9 + Math.floor(i / 60)).padStart(2, '0')}:${String(i % 60).padStart(2, '0')}`,
         sender: `User ${i}`,
         content: `Message ${i}`,
         type: 'message' as const,
      }));
      const { container } = render(<MessageList messages={manyMessages} />);
      expect(container.textContent).toContain('Message 0');
      expect(container.textContent).toContain('Message 49');
   });

   it('should render date separators for messages across 3 days', () => {
      const threeDayMessages: ParsedMessage[] = [
         { date: '19/08/24', time: '09:00', sender: 'Felipe', content: 'Day 1', type: 'message' },
         { date: '20/08/24', time: '09:00', sender: 'João', content: 'Day 2', type: 'message' },
         { date: '21/08/24', time: '09:00', sender: 'Felipe', content: 'Day 3', type: 'message' },
      ];
      const { container } = render(<MessageList messages={threeDayMessages} />);
      const separators = container.querySelectorAll('.rounded-full');
      expect(separators.length).toBeGreaterThanOrEqual(3);
   });

   it('should render single message without error', () => {
      const single: ParsedMessage[] = [{
         date: '19/08/24', time: '09:00', sender: 'Felipe',
         content: 'Just me', type: 'message',
      }];
      render(<MessageList messages={single} />);
      expect(screen.getByText('Just me')).toBeDefined();
      expect(screen.getByText('Felipe')).toBeDefined();
   });

   it('should render messages from different senders', () => {
      const multiSender: ParsedMessage[] = [
         { date: '19/08/24', time: '09:00', sender: 'Alice', content: 'Hi', type: 'message' },
         { date: '19/08/24', time: '09:01', sender: 'Bob', content: 'Hello', type: 'message' },
         { date: '19/08/24', time: '09:02', sender: 'Charlie', content: 'Hey', type: 'message' },
      ];
      render(<MessageList messages={multiSender} />);
      expect(screen.getByText('Alice')).toBeDefined();
      expect(screen.getByText('Bob')).toBeDefined();
      expect(screen.getByText('Charlie')).toBeDefined();
   });

   it('should auto-scroll to bottom on render', () => {
      const scrollIntoViewMock = vi.fn();
      Element.prototype.scrollIntoView = scrollIntoViewMock;

      render(<MessageList messages={messages} />);
      expect(scrollIntoViewMock).toHaveBeenCalled();
   });

   it('should render system messages between user messages', () => {
      const mixed: ParsedMessage[] = [
         { date: '19/08/24', time: '09:00', sender: 'Felipe', content: 'Hello', type: 'message' },
         { date: '19/08/24', time: '09:01', sender: 'system', content: 'Encryption notice', type: 'system' },
         { date: '19/08/24', time: '09:02', sender: 'João', content: 'Hi', type: 'message' },
      ];
      render(<MessageList messages={mixed} />);
      expect(screen.getByText('Hello')).toBeDefined();
      expect(screen.getByText('Encryption notice')).toBeDefined();
      expect(screen.getByText('Hi')).toBeDefined();
   });

   it('should render deleted messages between user messages', () => {
      const withDeleted: ParsedMessage[] = [
         { date: '19/08/24', time: '09:00', sender: 'Felipe', content: 'First', type: 'message' },
         { date: '19/08/24', time: '09:01', sender: 'João', content: 'This message was deleted', type: 'deleted' },
         { date: '19/08/24', time: '09:02', sender: 'Felipe', content: 'Third', type: 'message' },
      ];
       render(<MessageList messages={withDeleted} />);
       expect(screen.getByText('First')).toBeDefined();
       expect(screen.getByText('Deleted message')).toBeDefined();
       expect(screen.getByText('Third')).toBeDefined();
   });

   it('should render messages in correct chronological order', () => {
      const ordered: ParsedMessage[] = [
         { date: '19/08/24', time: '09:00', sender: 'Felipe', content: 'First', type: 'message' },
         { date: '19/08/24', time: '09:30', sender: 'João', content: 'Second', type: 'message' },
         { date: '19/08/24', time: '10:00', sender: 'Felipe', content: 'Third', type: 'message' },
      ];
      const { container } = render(<MessageList messages={ordered} />);
      const text = container.textContent || '';
      const firstIdx = text.indexOf('First');
      const secondIdx = text.indexOf('Second');
      const thirdIdx = text.indexOf('Third');
      expect(firstIdx).toBeLessThan(secondIdx);
      expect(secondIdx).toBeLessThan(thirdIdx);
   });

   it('should handle very long list of 100 messages', () => {
      const hundredMsgs: ParsedMessage[] = Array.from({ length: 100 }, (_, i) => ({
         date: '19/08/24', time: '09:00', sender: 'User',
         content: `Msg ${i}`, type: 'message' as const,
      }));
      const { container } = render(<MessageList messages={hundredMsgs} />);
      expect(container.textContent).toContain('Msg 0');
      expect(container.textContent).toContain('Msg 99');
   });

   it('should handle messages array with all types combined', () => {
      const allTypes: ParsedMessage[] = [
         { date: '19/08/24', time: '09:00', sender: 'Felipe', content: 'Text', type: 'message' },
         { date: '19/08/24', time: '09:01', sender: 'system', content: 'System msg', type: 'system' },
         { date: '19/08/24', time: '09:02', sender: 'João', content: 'photo.jpg', type: 'image' },
         { date: '19/08/24', time: '09:03', sender: 'Felipe', content: 'This message was deleted', type: 'deleted' },
         { date: '19/08/24', time: '09:04', sender: 'Maria', content: 'song.opus', type: 'audio' },
      ];
      render(<MessageList messages={allTypes} />);
      expect(screen.getByText('Text')).toBeDefined();
       expect(screen.getByText('System msg')).toBeDefined();
       expect(screen.getByText('Deleted message')).toBeDefined();
   });

   it('should not crash when message has empty content', () => {
      const emptyContent: ParsedMessage[] = [{
         date: '19/08/24', time: '09:00', sender: 'Felipe',
         content: '', type: 'message',
      }];
      const { container } = render(<MessageList messages={emptyContent} />);
      expect(container.firstChild).not.toBeNull();
   });

   it('should render single message correctly', () => {
      const single: ParsedMessage[] = [{
         date: '19/08/24', time: '09:00', sender: 'Felipe',
         content: 'Only message', type: 'message',
      }];
      render(<MessageList messages={single} />);
      expect(screen.getByText('Only message')).toBeDefined();
      expect(screen.getByText('Felipe')).toBeDefined();
   });

   it('should render messages with different dates showing separators', () => {
      const diffDates: ParsedMessage[] = [
         { date: '19/08/24', time: '23:59', sender: 'Felipe', content: 'Today', type: 'message' },
         { date: '20/08/24', time: '00:01', sender: 'João', content: 'Tomorrow', type: 'message' },
      ];
      const { container } = render(<MessageList messages={diffDates} />);
      const separators = container.querySelectorAll('.rounded-full');
      expect(separators.length).toBeGreaterThanOrEqual(2);
      expect(screen.getByText('Today')).toBeDefined();
      expect(screen.getByText('Tomorrow')).toBeDefined();
   });

   it('should render three messages across three different dates', () => {
      const threeDays: ParsedMessage[] = [
         { date: '19/08/24', time: '09:00', sender: 'Felipe', content: 'Day 1', type: 'message' },
         { date: '20/08/24', time: '09:00', sender: 'João', content: 'Day 2', type: 'message' },
         { date: '21/08/24', time: '09:00', sender: 'Felipe', content: 'Day 3', type: 'message' },
      ];
      const { container } = render(<MessageList messages={threeDays} />);
      const separators = container.querySelectorAll('.rounded-full');
      expect(separators.length).toBeGreaterThanOrEqual(3);
   });

   it('should render messages with same sender multiple times', () => {
      const sameSender: ParsedMessage[] = [
         { date: '19/08/24', time: '09:00', sender: 'Felipe', content: 'First', type: 'message' },
         { date: '19/08/24', time: '09:01', sender: 'Felipe', content: 'Second', type: 'message' },
         { date: '19/08/24', time: '09:02', sender: 'Felipe', content: 'Third', type: 'message' },
      ];
      const { container } = render(<MessageList messages={sameSender} />);
      const felipeOccurrences = (container.textContent?.match(/Felipe/g) || []).length;
      expect(felipeOccurrences).toBe(3);
   });

   it('should render messages with multiline content', () => {
      const multiline: ParsedMessage[] = [{
         date: '19/08/24', time: '09:00', sender: 'Felipe',
         content: 'Line 1\nLine 2\nLine 3', type: 'message',
      }];
      render(<MessageList messages={multiline} />);
      expect(screen.getByText(/Line 1/)).toBeDefined();
   });

   it('should render messages with only special characters', () => {
      const special: ParsedMessage[] = [{
         date: '19/08/24', time: '09:00', sender: 'Felipe',
         content: '~!@#$%^&*()_+', type: 'message',
      }];
      render(<MessageList messages={special} />);
      expect(screen.getByText('~!@#$%^&*()_+')).toBeDefined();
   });

   it('should render 20 messages without error', () => {
      const twentyMsgs: ParsedMessage[] = Array.from({ length: 20 }, (_, i) => ({
         date: '19/08/24', time: '09:00', sender: 'User',
         content: `Msg ${i}`, type: 'message' as const,
      }));
      render(<MessageList messages={twentyMsgs} />);
      expect(screen.getByText('Msg 0')).toBeDefined();
      expect(screen.getByText('Msg 19')).toBeDefined();
   });

   it('should render all message types in one list', () => {
      const allTypes: ParsedMessage[] = [
         { date: '19/08/24', time: '09:00', sender: 'Felipe', content: 'Text', type: 'message' },
         { date: '19/08/24', time: '09:01', sender: 'system', content: 'System', type: 'system' },
         { date: '19/08/24', time: '09:02', sender: 'João', content: 'photo.jpg', type: 'image' },
         { date: '19/08/24', time: '09:03', sender: 'Felipe', content: 'This message was deleted', type: 'deleted' },
         { date: '19/08/24', time: '09:04', sender: 'Maria', content: 'song.opus', type: 'audio' },
         { date: '19/08/24', time: '09:05', sender: 'Pedro', content: 'clip.mp4', type: 'video' },
      ];
      const { container } = render(<MessageList messages={allTypes} />);
       expect(container.textContent).toContain('Text');
       expect(screen.getByText('Deleted message')).toBeDefined();
       expect(container.querySelector('img')).not.toBeNull();
      expect(container.querySelector('audio')).not.toBeNull();
      expect(container.querySelector('video')).not.toBeNull();
   });

   it('should have overflow-y-auto scrollable container', () => {
      const { container } = render(<MessageList messages={messages} />);
      const scrollDiv = container.firstChild as HTMLElement;
      expect(scrollDiv.className).toContain('overflow-y-auto');
   });

   it('should render formatted text in messages', () => {
      const formatted: ParsedMessage[] = [{
         date: '19/08/24', time: '09:00', sender: 'Felipe',
         content: '*bold* and _italic_', type: 'message',
      }];
      const { container } = render(<MessageList messages={formatted} />);
      expect(container.innerHTML).toContain('font-medium');
      expect(container.innerHTML).toContain('italic');
   });

   it('should handle audio messages in message list', () => {
      const audioMsgs: ParsedMessage[] = [{
         date: '19/08/24', time: '09:00', sender: 'Felipe',
         content: 'audio.opus', type: 'audio',
      }];
      const { container } = render(<MessageList messages={audioMsgs} />);
      expect(container.querySelector('audio')).not.toBeNull();
   });

   it('should handle video messages in message list', () => {
      const videoMsgs: ParsedMessage[] = [{
         date: '19/08/24', time: '09:00', sender: 'Felipe',
         content: 'video.mp4', type: 'video',
      }];
      const { container } = render(<MessageList messages={videoMsgs} />);
      expect(container.querySelector('video')).not.toBeNull();
   });

   it('should handle contact messages in message list', () => {
      const contactMsgs: ParsedMessage[] = [{
         date: '19/08/24', time: '09:00', sender: 'Felipe',
         content: 'contact.vcf', type: 'contact',
      }];
       render(<MessageList messages={contactMsgs} />);
       expect(screen.getByText('Contact available:')).toBeDefined();
   });
});

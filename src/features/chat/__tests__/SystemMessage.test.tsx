import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SystemMessage } from '@/features/chat/components/SystemMessage';

describe('SystemMessage', () => {
   it('should render system message content', () => {
      render(<SystemMessage content="Messages and calls are end-to-end encrypted." />);
      const el = screen.getByText('Messages and calls are end-to-end encrypted.');
      expect(el).toBeDefined();
   });

   it('should be centered in the chat', () => {
      const { container } = render(<SystemMessage content="Teste" />);
      const parent = container.firstChild as HTMLElement;
      expect(parent.className).toContain('flex');
      expect(parent.className).toContain('justify-center');
   });

   it('should have italic style', () => {
      render(<SystemMessage content="Italic message" />);
      const el = screen.getByText('Italic message');
      expect(el.className).toContain('italic');
   });

   it('should have small text size', () => {
      render(<SystemMessage content="Small text" />);
      const el = screen.getByText('Small text');
      expect(el.className).toContain('text-xs');
   });

   it('should have gray text', () => {
      render(<SystemMessage content="Gray text" />);
      const el = screen.getByText('Gray text');
      expect(el.className).toContain('text-gray-500');
   });

   it('should have white background with opacity', () => {
      render(<SystemMessage content="Bg test" />);
      const el = screen.getByText('Bg test');
      expect(el.className).toContain('bg-white/70');
   });

   it('should have rounded corners', () => {
      render(<SystemMessage content="Rounded" />);
      const el = screen.getByText('Rounded');
      expect(el.className).toContain('rounded-lg');
   });

   it('should have max-width constraint', () => {
      render(<SystemMessage content="Max width" />);
      const el = screen.getByText('Max width');
      expect(el.className).toContain('max-w-[85%]');
   });

   it('should render group creation messages', () => {
      render(<SystemMessage content='Emília created group "Ed. Vitória Park"' />);
      expect(screen.getByText(/Emília created group/)).toBeDefined();
   });

   it('should render participant added messages', () => {
      render(<SystemMessage content="Emília added Dona Cristina" />);
      expect(screen.getByText(/Emília added Dona Cristina/)).toBeDefined();
   });

   it('should render encryption info messages', () => {
      render(<SystemMessage content="Messages are end-to-end encrypted." />);
      expect(screen.getByText(/encrypted/)).toBeDefined();
   });

   it('should render long system messages', () => {
      const longMsg = 'A'.repeat(200);
      render(<SystemMessage content={longMsg} />);
      const el = screen.getByText(longMsg);
      expect(el).toBeDefined();
   });

   it('should have padding on the message', () => {
      render(<SystemMessage content="Padding" />);
      const el = screen.getByText('Padding');
      expect(el.className).toContain('px-4');
      expect(el.className).toContain('py-1.5');
   });

   it('should have shadow effect', () => {
      render(<SystemMessage content="Shadow" />);
      const el = screen.getByText('Shadow');
      expect(el.className).toContain('shadow-sm');
   });

   it('should render participant removed messages', () => {
      render(<SystemMessage content="Felipe removed João" />);
      expect(screen.getByText(/Felipe removed/)).toBeDefined();
   });

   it('should render pinned message system text', () => {
      render(<SystemMessage content='Felipe pinned "Important notice"' />);
      expect(screen.getByText(/pinned/)).toBeDefined();
   });

   it('should render pin icon for pinned messages', () => {
      const { container } = render(<SystemMessage content='Felipe pinned a message' />);
      const pinSvg = container.querySelector('svg');
      expect(pinSvg).not.toBeNull();
   });

   it('should not render pin icon for non-pinned messages', () => {
      const { container } = render(<SystemMessage content='Felipe added Maria' />);
      const pinSvg = container.querySelector('svg');
      expect(pinSvg).toBeNull();
   });

   it('should render security code changed message', () => {
      render(<SystemMessage content="Your security code changed" />);
      expect(screen.getByText(/security code/)).toBeDefined();
   });

   it('should render group description changed message', () => {
      render(<SystemMessage content="Felipe changed the group description" />);
      expect(screen.getByText(/group description/)).toBeDefined();
   });

   it('should render group icon changed message', () => {
      render(<SystemMessage content="Felipe changed this group's icon" />);
      expect(screen.getByText(/icon/)).toBeDefined();
   });

   it('should handle message with HTML special characters', () => {
      render(<SystemMessage content="Price < 10 & > 5" />);
      expect(screen.getByText('Price < 10 & > 5')).toBeDefined();
   });

   it('should handle message containing only numbers', () => {
      render(<SystemMessage content="12345" />);
      expect(screen.getByText('12345')).toBeDefined();
   });

   it('should handle message in Portuguese', () => {
      render(<SystemMessage content="Mensagens e chamadas são criptografadas" />);
      expect(screen.getByText('Mensagens e chamadas são criptografadas')).toBeDefined();
   });

   it('should handle message with emoji', () => {
      render(<SystemMessage content="Bem-vindo ao grupo 🎉" />);
      expect(screen.getByText('Bem-vindo ao grupo 🎉')).toBeDefined();
   });

   it('should have my-1 vertical margin on container', () => {
      const { container } = render(<SystemMessage content="Margin test" />);
      const parent = container.firstChild as HTMLElement;
      expect(parent.className).toContain('my-1');
   });

   it('should render in a flex container with justify-center', () => {
      const { container } = render(<SystemMessage content="Flex test" />);
      const parent = container.firstChild as HTMLElement;
      expect(parent.className).toContain('flex');
      expect(parent.className).toContain('justify-center');
   });

   it('should have text-center alignment on content', () => {
      render(<SystemMessage content="Center test" />);
      const el = screen.getByText('Center test');
      expect(el.className).toContain('text-center');
   });

   it('should render without crashing for empty string content', () => {
      const { container } = render(<SystemMessage content="" />);
      expect(container.firstChild).not.toBeNull();
   });

   it('should render "You created group" message', () => {
      render(<SystemMessage content='You created group "Test Group"' />);
      expect(screen.getByText(/You created group/)).toBeDefined();
   });

   it('should render "You were added" message', () => {
      render(<SystemMessage content="You were added" />);
      expect(screen.getByText('You were added')).toBeDefined();
   });

   it('should render "You removed" message', () => {
      render(<SystemMessage content="You removed Emília" />);
      expect(screen.getByText(/You removed/)).toBeDefined();
   });

   it('should render "changed the subject from" message', () => {
      render(<SystemMessage content='Felipe changed the subject from "Old" to "New"' />);
      expect(screen.getByText(/changed the subject/)).toBeDefined();
   });

   it('should render message with only whitespace', () => {
      const { container } = render(<SystemMessage content="   " />);
      expect(container.firstChild).not.toBeNull();
   });

   it('should render very short message with single character', () => {
      render(<SystemMessage content="A" />);
      expect(screen.getByText('A')).toBeDefined();
   });

   it('should render message with line breaks', () => {
      const { container } = render(<SystemMessage content="Line 1\nLine 2\nLine 3" />);
      expect(container.textContent).toContain('Line 1');
   });

   it('should render "security code changed" message variant', () => {
      render(<SystemMessage content="Your security code with Felipe changed." />);
      expect(screen.getByText(/security code/)).toBeDefined();
   });

   it('should have proper span content styling', () => {
      render(<SystemMessage content="Styled content" />);
      const el = screen.getByText('Styled content');
      expect(el.className).toContain('italic');
      expect(el.className).toContain('text-xs');
      expect(el.className).toContain('text-gray-500');
      expect(el.className).toContain('text-center');
   });
});

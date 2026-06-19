import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChatHeader } from '@/features/chat/components/ChatHeader';

describe('ChatHeader', () => {
   it('should render the group title', () => {
      render(<ChatHeader title="Ed. Vitória Park" />);
      expect(screen.getByText('Ed. Vitória Park')).toBeDefined();
   });

   it('should show initials as avatar', () => {
      render(<ChatHeader title="Ed. Vitória Park" />);
      expect(screen.getByText('EV')).toBeDefined();
   });

   it('should render single word title initials', () => {
      render(<ChatHeader title="WhatsApp" />);
      expect(screen.getByText('W')).toBeDefined();
   });

   it('should render three word title initials (first two)', () => {
      render(<ChatHeader title="Ed Vitoria Park" />);
      expect(screen.getByText('EV')).toBeDefined();
   });

   it('should render default title when not provided', () => {
      render(<ChatHeader />);
       expect(screen.getByText('WhatsApp History')).toBeDefined();
    });

    it('should default title show WH initials', () => {
       render(<ChatHeader />);
       expect(screen.getByText('WH')).toBeDefined();
   });

   it('should render search icon', () => {
      const { container } = render(<ChatHeader title="Test" />);
      const svgs = container.querySelectorAll('svg');
      expect(svgs.length).toBeGreaterThan(0);
   });

   it('should render avatar circle', () => {
      const { container } = render(<ChatHeader title="Test" />);
      const avatar = container.querySelector('.rounded-full');
      expect(avatar).not.toBeNull();
   });

   it('should have dark green background', () => {
      const { container } = render(<ChatHeader title="Test" />);
      const header = container.querySelector('header');
      expect(header?.className).toContain('bg-[#075E54]');
   });

   it('should handle empty title', () => {
      const { container } = render(<ChatHeader title="" />);
      // Should render something without crashing
      expect(container.querySelector('header')).not.toBeNull();
   });

   it('should be sticky positioned', () => {
      const { container } = render(<ChatHeader title="Test" />);
      const header = container.querySelector('header');
      expect(header?.className).toContain('sticky');
   });

   it('should have white text', () => {
      const { container } = render(<ChatHeader title="Test" />);
      const header = container.querySelector('header');
      expect(header?.className).toContain('text-white');
   });

   it('should render two icon buttons', () => {
      const { container } = render(<ChatHeader title="Test" />);
      const buttons = container.querySelectorAll('svg');
      expect(buttons.length).toBeGreaterThanOrEqual(2);
   });

   it('should render title with special characters', () => {
      render(<ChatHeader title="Ed. Vitória Park @ #$%" />);
      expect(screen.getByText('Ed. Vitória Park @ #$%')).toBeDefined();
   });

   it('should render very long title with truncation', () => {
      const longTitle = 'A'.repeat(100);
      const { container } = render(<ChatHeader title={longTitle} />);
      const h1 = container.querySelector('h1');
      expect(h1?.className).toContain('truncate');
   });

   it('should render title with only one letter', () => {
      const { container } = render(<ChatHeader title="A" />);
      // Title appears in both avatar and h1, use container to find h1
      const h1 = container.querySelector('h1');
      expect(h1?.textContent).toBe('A');
   });

   it('should render title with numbers', () => {
      render(<ChatHeader title="Grupo 123" />);
      expect(screen.getByText('Grupo 123')).toBeDefined();
      expect(screen.getByText('G1')).toBeDefined();
   });

   it('should render title with multiple consecutive spaces', () => {
      const { container } = render(<ChatHeader title="Grupo    Teste" />);
      // "Grupo    Teste".split(' ') = ['Grupo', '', '', '', 'Teste']
      // initials become 'GT', not 'G'
      const avatar = container.querySelector('.rounded-full');
      expect(avatar?.textContent).toBe('GT');
   });

   it('should handle title with leading spaces', () => {
      const { container } = render(<ChatHeader title="  Grupo Teste" />);
      // "  Grupo Teste".split(' ') = ['', '', 'Grupo', 'Teste']
      // initials become 'GT' (empty + G = ' G' → slice(0,2) = ' G' → toUpperCase = ' G')
      // Then rendered in the avatar div
      const avatar = container.querySelector('.rounded-full');
      expect(avatar).not.toBeNull();
   });

   it('should handle title with trailing spaces', () => {
      const { container } = render(<ChatHeader title="Grupo Teste  " />);
      const avatar = container.querySelector('.rounded-full');
      expect(avatar?.textContent).toBe('GT');
   });

   it('should have flex items-center on header', () => {
      const { container } = render(<ChatHeader title="Test" />);
      const header = container.querySelector('header');
      const classes = header?.className || '';
      expect(classes).toContain('flex');
      expect(classes).toContain('items-center');
   });

   it('should have gap-3 on header container', () => {
      const { container } = render(<ChatHeader title="Test" />);
      const header = container.querySelector('header');
      expect(header?.className).toContain('gap-3');
   });

   it('should have z-10 positioning', () => {
      const { container } = render(<ChatHeader title="Test" />);
      const header = container.querySelector('header');
      expect(header?.className).toContain('z-10');
   });

   it('should have shadow-md class', () => {
      const { container } = render(<ChatHeader title="Test" />);
      const header = container.querySelector('header');
      expect(header?.className).toContain('shadow-md');
   });

   it('should have vertical padding py-3', () => {
      const { container } = render(<ChatHeader title="Test" />);
      const header = container.querySelector('header');
      expect(header?.className).toContain('py-3');
   });

   it('should have horizontal padding px-4', () => {
      const { container } = render(<ChatHeader title="Test" />);
      const header = container.querySelector('header');
      expect(header?.className).toContain('px-4');
   });

   it('should render avatar circle with correct background', () => {
      const { container } = render(<ChatHeader title="Test" />);
      const avatar = container.querySelector('.rounded-full');
      expect(avatar?.className).toContain('bg-[#6BA89E]');
   });

   it('should render search icon SVG element', () => {
      const { container } = render(<ChatHeader title="Test" />);
      const svgs = container.querySelectorAll('svg');
      expect(svgs.length).toBeGreaterThanOrEqual(2);
   });

   it('should render title with non-Latin characters', () => {
      render(<ChatHeader title="グループチャット" />);
      expect(screen.getByText('グループチャット')).toBeDefined();
   });

   it('should render title with Cyrillic characters', () => {
      render(<ChatHeader title="Групповой чат" />);
      expect(screen.getByText('Групповой чат')).toBeDefined();
      expect(screen.getByText('ГЧ')).toBeDefined();
   });

   it('should render title with mixed scripts', () => {
      render(<ChatHeader title="Grupo グループ" />);
      expect(screen.getByText('Grupo グループ')).toBeDefined();
      expect(screen.getByText('Gグ')).toBeDefined();
   });

   it('should render title that is only numbers', () => {
      const { container } = render(<ChatHeader title="12345" />);
      expect(screen.getByText('12345')).toBeDefined();
      const avatar = container.querySelector('.rounded-full');
      // getInitials("12345".split(' ')) = ["12345"] → ["1"] → "1" → slice(0,2) = "1"
      expect(avatar?.textContent).toBe('1');
   });

   it('should render avatar with white text', () => {
      const { container } = render(<ChatHeader title="Test" />);
      const avatar = container.querySelector('.rounded-full');
      expect(avatar?.className).toContain('text-white');
   });

   it('should render title in h1 element', () => {
      const { container } = render(<ChatHeader title="Test Title" />);
      const h1 = container.querySelector('h1');
      expect(h1?.textContent).toBe('Test Title');
   });

   it('should render with proper header structure', () => {
      const { container } = render(<ChatHeader title="Test" />);
      const header = container.querySelector('header');
      expect(header?.querySelector('.rounded-full')).not.toBeNull();
      expect(header?.querySelector('h1')).not.toBeNull();
   });

   it('should render header icons (theme toggle, search, menu)', () => {
      const { container } = render(<ChatHeader title="Test" />);
      const svgs = container.querySelectorAll('svg');
      expect(svgs.length).toBeGreaterThanOrEqual(3); // ThemeToggle + Search + UserMenu icons
   });
});

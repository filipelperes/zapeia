import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DateSeparator } from '@/features/chat/components/DateSeparator';

describe('DateSeparator', () => {
   it('should render formatted date', () => {
      render(<DateSeparator date="19/08/24" time="09:28" />);
      expect(screen.getByText(/2024/)).toBeDefined();
   });

   it('should be centered in the chat', () => {
      const { container } = render(<DateSeparator date="19/08/24" time="09:28" />);
      const parent = container.firstChild as HTMLElement;
      expect(parent.className).toContain('flex');
      expect(parent.className).toContain('justify-center');
   });

   it('should have rounded-full style', () => {
      render(<DateSeparator date="19/08/24" time="09:28" />);
      const el = screen.getByText(/2024/);
      expect(el.className).toContain('rounded-full');
   });

   it('should display fallback for invalid dates', () => {
      render(<DateSeparator date="invalid" time="10:30" />);
      expect(screen.getByText('10:30')).toBeDefined();
   });

   it('should handle different date formats', () => {
      render(<DateSeparator date="8/8/24" time="14:30" />);
      expect(screen.getByText(/2024/)).toBeDefined();
   });

   it('should handle full year dates', () => {
      render(<DateSeparator date="19/08/2024" time="09:28" />);
      expect(screen.getByText(/2024/)).toBeDefined();
   });

   it('should render date with d/M/yy single digits format', () => {
      render(<DateSeparator date="8/8/24" time="14:30" />);
      expect(screen.getByText(/2024/)).toBeDefined();
   });

   it('should render date with M/d/yy format', () => {
      render(<DateSeparator date="8/19/24" time="10:00" />);
      expect(screen.getByText(/2024/)).toBeDefined();
   });

   it('should render date with single digit month and day', () => {
      render(<DateSeparator date="1/5/24" time="08:00" />);
      expect(screen.getByText(/2024/)).toBeDefined();
   });

   it('should render fallback time when date is empty string', () => {
      render(<DateSeparator date="" time="15:45" />);
      expect(screen.getByText('15:45')).toBeDefined();
   });

   it('should render fallback when time is empty', () => {
      const { container } = render(<DateSeparator date="19/08/24" time="" />);
      // Should not break, just renders the container
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain('flex');
   });

   it('should render fallback when both date and time are empty', () => {
      const { container } = render(<DateSeparator date="" time="" />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain('justify-center');
   });

   it('should handle midnight time 00:00', () => {
      render(<DateSeparator date="19/08/24" time="00:00" />);
      expect(screen.getByText(/2024/)).toBeDefined();
   });

   it('should have shadow-sm class', () => {
      render(<DateSeparator date="19/08/24" time="09:28" />);
      const el = screen.getByText(/2024/);
      expect(el.className).toContain('shadow-sm');
   });

   it('should have select-none class', () => {
      render(<DateSeparator date="19/08/24" time="09:28" />);
      const el = screen.getByText(/2024/);
      expect(el.className).toContain('select-none');
   });

   it('should have text-xs class', () => {
      render(<DateSeparator date="19/08/24" time="09:28" />);
      const el = screen.getByText(/2024/);
      expect(el.className).toContain('text-xs');
   });

   it('should have bg-white/80 class', () => {
      render(<DateSeparator date="19/08/24" time="09:28" />);
      const el = screen.getByText(/2024/);
      expect(el.className).toContain('bg-white/80');
   });

   it('should have my-2 vertical margin on container', () => {
      const { container } = render(<DateSeparator date="19/08/24" time="09:28" />);
      const parent = container.firstChild as HTMLElement;
      expect(parent.className).toContain('my-2');
   });

   it('should handle dates from year 2023', () => {
      render(<DateSeparator date="19/08/23" time="09:28" />);
      expect(screen.getByText(/2023/)).toBeDefined();
   });

   it('should handle dates from year 2022', () => {
      render(<DateSeparator date="19/08/22" time="09:28" />);
      expect(screen.getByText(/2022/)).toBeDefined();
   });

   it('should handle dates from year 2026', () => {
      render(<DateSeparator date="19/08/26" time="09:28" />);
      expect(screen.getByText(/2026/)).toBeDefined();
   });

   it('should render date with AM time format', () => {
      render(<DateSeparator date="19/08/24" time="9:28 AM" />);
      expect(screen.getByText(/2024/)).toBeDefined();
   });

   it('should render date with PM time format', () => {
      render(<DateSeparator date="19/08/24" time="3:30 PM" />);
      expect(screen.getByText(/2024/)).toBeDefined();
   });

   it('should have px-3 padding on the date span', () => {
      render(<DateSeparator date="19/08/24" time="09:28" />);
      const el = screen.getByText(/2024/);
      expect(el.className).toContain('px-3');
   });

   it('should have py-1 padding on the date span', () => {
      render(<DateSeparator date="19/08/24" time="09:28" />);
      const el = screen.getByText(/2024/);
      expect(el.className).toContain('py-1');
   });

   it('should handle M/d/yy format with AM/PM', () => {
      render(<DateSeparator date="8/19/24" time="9:15 AM" />);
      expect(screen.getByText(/2024/)).toBeDefined();
   });

   it('should handle date with full year and AM/PM', () => {
      render(<DateSeparator date="19/08/2024" time="9:28 AM" />);
      expect(screen.getByText(/2024/)).toBeDefined();
   });

   it('should render with text-gray-500 class', () => {
      render(<DateSeparator date="19/08/24" time="09:28" />);
      const el = screen.getByText(/2024/);
      expect(el.className).toContain('text-gray-500');
   });

   it('should handle date with seconds and AM/PM time', () => {
      render(<DateSeparator date="19/08/24" time="9:28:45 AM" />);
      expect(screen.getByText(/2024/)).toBeDefined();
   });
});

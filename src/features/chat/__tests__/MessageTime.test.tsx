import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MessageTime } from '@/features/chat/components/MessageTime';

describe('MessageTime', () => {
   it('should display formatted date and time', () => {
      render(<MessageTime date="19/08/24" time="09:28" />);
      const el = screen.getByText(/2024/);
      expect(el).toBeDefined();
   });

   it('should fallback to time when date is invalid', () => {
      render(<MessageTime date="invalid" time="09:28" />);
      expect(screen.getByText('09:28')).toBeDefined();
   });

   it('should display correct day and month', () => {
      render(<MessageTime date="19/08/24" time="09:28" />);
      const el = screen.getByText(/19/);
      expect(el).toBeDefined();
   });

   it('should display in Brazilian format', () => {
      render(<MessageTime date="19/08/24" time="09:28" />);
      const el = screen.getByText(/2024/);
      expect(el).toBeDefined();
   });

   it('should have small gray text', () => {
      render(<MessageTime date="19/08/24" time="09:28" />);
      const el = screen.getByText(/2024/);
      expect(el.className).toContain('text-gray-400');
   });

   it('should have small font size', () => {
      render(<MessageTime date="19/08/24" time="09:28" />);
      const el = screen.getByText(/2024/);
      expect(el.className).toContain('text-[11px]');
   });

   it('should be selectable as none', () => {
      render(<MessageTime date="19/08/24" time="09:28" />);
      const el = screen.getByText(/2024/);
      expect(el.className).toContain('select-none');
   });

   it('should handle different time formats', () => {
      render(<MessageTime date="19/08/24" time="14:30" />);
      expect(screen.getByText(/2024/)).toBeDefined();
   });

   it('should handle AM/PM times', () => {
      render(<MessageTime date="19/08/24" time="9:28 PM" />);
      expect(screen.getByText(/2024/)).toBeDefined();
   });

   it('should fallback for completely invalid input', () => {
      const { container } = render(<MessageTime date="" time="" />);
      const el = container.querySelector('.select-none');
      expect(el).not.toBeNull();
   });

   it('should handle M/d/yy format', () => {
      render(<MessageTime date="8/19/24" time="10:00" />);
      expect(screen.getByText(/2024/)).toBeDefined();
   });

   it('should handle full year format', () => {
      render(<MessageTime date="19/08/2024" time="09:28" />);
      expect(screen.getByText(/2024/)).toBeDefined();
   });

   it('should format date with seconds', () => {
      render(<MessageTime date="19/08/24" time="09:28:45" />);
      expect(screen.getByText(/2024/)).toBeDefined();
   });

   it('should format date with seconds and AM/PM', () => {
      render(<MessageTime date="19/08/24" time="2:28:45 PM" />);
      expect(screen.getByText(/2024/)).toBeDefined();
   });

   it('should handle completely empty strings without crashing', () => {
      const { container } = render(<MessageTime date="" time="" />);
      expect(container.querySelector('.select-none')).not.toBeNull();
   });

   it('should handle empty date with valid time', () => {
      render(<MessageTime date="" time="15:45" />);
      expect(screen.getByText('15:45')).toBeDefined();
   });

   it('should handle empty time with valid date', () => {
      const { container } = render(<MessageTime date="19/08/24" time="" />);
      const el = container.querySelector('.select-none');
      expect(el).not.toBeNull();
   });

   it('should format midnight time correctly', () => {
      render(<MessageTime date="19/08/24" time="00:00" />);
      expect(screen.getByText(/2024/)).toBeDefined();
   });

   it('should format noon time correctly', () => {
      render(<MessageTime date="19/08/24" time="12:00" />);
      expect(screen.getByText(/2024/)).toBeDefined();
   });

   it('should handle single digit day', () => {
      render(<MessageTime date="8/19/24" time="10:00" />);
      expect(screen.getByText(/2024/)).toBeDefined();
   });

   it('should handle single digit month', () => {
      render(<MessageTime date="1/19/24" time="10:00" />);
      expect(screen.getByText(/2024/)).toBeDefined();
   });

   it('should handle single digit month and day', () => {
      render(<MessageTime date="1/5/24" time="08:00" />);
      expect(screen.getByText(/2024/)).toBeDefined();
   });

   it('should format dates from year 2023', () => {
      render(<MessageTime date="19/08/23" time="09:28" />);
      expect(screen.getByText(/2023/)).toBeDefined();
   });

   it('should format dates from year 2025', () => {
      render(<MessageTime date="19/08/25" time="09:28" />);
      expect(screen.getByText(/2025/)).toBeDefined();
   });

   it('should format dates from year 2022', () => {
      render(<MessageTime date="19/08/22" time="09:28" />);
      expect(screen.getByText(/2022/)).toBeDefined();
   });

   it('should format dates from year 2026', () => {
      render(<MessageTime date="19/08/26" time="09:28" />);
      expect(screen.getByText(/2026/)).toBeDefined();
   });

   it('should format dates from year 2000', () => {
      render(<MessageTime date="19/08/00" time="09:28" />);
      expect(screen.getByText(/2000/)).toBeDefined();
   });

   it('should format date with 24-hour time across full day range', () => {
      render(<MessageTime date="19/08/24" time="23:59" />);
      const el = screen.getByText(/2024/);
      expect(el).toBeDefined();
   });

   it('should format date with seconds and AM/PM time', () => {
      render(<MessageTime date="19/08/24" time="2:28:45 PM" />);
      expect(screen.getByText(/2024/)).toBeDefined();
   });

   it('should display fallback for invalid date with time only', () => {
      render(<MessageTime date="invalid" time="10:30" />);
      expect(screen.getByText('10:30')).toBeDefined();
   });

   it('should have select-none class on time element', () => {
      render(<MessageTime date="19/08/24" time="09:28" />);
      const el = screen.getByText(/2024/);
      expect(el.className).toContain('select-none');
   });

   it('should have text-gray-400 class on time element', () => {
      render(<MessageTime date="19/08/24" time="09:28" />);
      const el = screen.getByText(/2024/);
      expect(el.className).toContain('text-gray-400');
   });

   it('should have text-[11px] class on time element', () => {
      render(<MessageTime date="19/08/24" time="09:28" />);
      const el = screen.getByText(/2024/);
      expect(el.className).toContain('text-[11px]');
   });

   it('should display formatted time as text content', () => {
      render(<MessageTime date="19/08/24" time="09:28" />);
      const el = screen.getByText(/2024/);
      expect(el.textContent).toBeTruthy();
   });
});

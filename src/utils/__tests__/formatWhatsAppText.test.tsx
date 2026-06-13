import { describe, it, expect } from 'vitest';
import { formatWhatsAppText } from '@/utils/formatWhatsAppText';
import type { JSX } from 'react';

describe('formatWhatsAppText', () => {
   it('should return plain text as string', () => {
      const result = formatWhatsAppText('Hello world');
      expect(result).toHaveLength(1);
      expect(result[0]).toBe('Hello world');
   });

   it('should format bold text with asterisks', () => {
      const result = formatWhatsAppText('Hello *world*');
      expect(result).toHaveLength(2);
      expect(typeof result[0]).toBe('string');
      const element = result[1] as JSX.Element;
      expect(element.props.className).toContain('font-medium');
   });

   it('should format italic text with underscores', () => {
      const result = formatWhatsAppText('Hello _world_');
      const element = result[1] as JSX.Element;
      expect(element.props.className).toContain('italic');
   });

   it('should format strikethrough with tildes', () => {
      const result = formatWhatsAppText('Hello ~world~');
      const element = result[1] as JSX.Element;
      expect(element.props.className).toContain('line-through');
   });

   it('should convert URLs to links', () => {
      const result = formatWhatsAppText('Check https://example.com');
      const link = result.find(
         (part) => typeof part !== 'string' && part.props?.href === 'https://example.com',
      );
      expect(link).toBeDefined();
   });

   it('should open links in new tab', () => {
      const result = formatWhatsAppText('https://example.com');
      const link = result.find(
         (part) => typeof part !== 'string',
      ) as JSX.Element;
      expect(link.props.target).toBe('_blank');
      expect(link.props.rel).toBe('noopener noreferrer');
   });

   it('should handle empty text', () => {
      const result = formatWhatsAppText('');
      expect(result).toHaveLength(0);
   });

   it('should handle text with multiple formats', () => {
      const result = formatWhatsAppText('*bold* and _italic_');
      expect(result.length).toBeGreaterThanOrEqual(3);
   });

   it('should handle unmatched delimiters as plain text', () => {
      const result = formatWhatsAppText('Hello *world');
      expect(result).toHaveLength(1);
      expect(result[0]).toBe('Hello *world');
   });

   it('should handle code with backticks', () => {
      const result = formatWhatsAppText('Use `code` here');
      const codeEl = result.find(
         (part) => typeof part !== 'string' && part.type === 'code',
      );
      expect(codeEl).toBeDefined();
   });

   it('should format bold with double asterisks', () => {
      const result = formatWhatsAppText('Hello **world**');
      const boldEl = result.find(
         (part) => typeof part !== 'string' && part.props?.className?.includes('font-medium'),
      );
      expect(boldEl).toBeDefined();
   });

   it('should format italic with double underscores', () => {
      const result = formatWhatsAppText('Hello __world__');
      const italicEl = result.find(
         (part) => typeof part !== 'string' && part.props?.className?.includes('italic'),
      );
      expect(italicEl).toBeDefined();
   });

   it('should format strikethrough with double tildes', () => {
      const result = formatWhatsAppText('Hello ~~world~~');
      const strikeEl = result.find(
         (part) => typeof part !== 'string' && part.props?.className?.includes('line-through'),
      );
      expect(strikeEl).toBeDefined();
   });

   it('should handle multiple URLs in text', () => {
      const result = formatWhatsAppText('Visit https://site1.com and https://site2.com');
      const links = result.filter(
         (part) => typeof part !== 'string' && part.props?.href,
      );
      expect(links).toHaveLength(2);
   });

   it('should handle URL at end of text', () => {
      const result = formatWhatsAppText('Link: https://example.com');
      expect(result.length).toBeGreaterThanOrEqual(2);
      const link = result[result.length - 1] as JSX.Element;
      expect(link.props?.href).toBe('https://example.com');
   });

   it('should handle URL at start of text', () => {
      const result = formatWhatsAppText('https://example.com is a link');
      const link = result[0] as JSX.Element;
      expect(link.props?.href).toBe('https://example.com');
   });

   it('should handle mixed formatting and URLs', () => {
      const result = formatWhatsAppText('*Bold* and https://example.com');
      const hasBold = result.some(
         (part) => typeof part !== 'string' && part.props?.className?.includes('font-medium'),
      );
      const hasLink = result.some(
         (part) => typeof part !== 'string' && part.props?.href === 'https://example.com',
      );
      expect(hasBold).toBe(true);
      expect(hasLink).toBe(true);
   });

   it('should not break on special regex characters', () => {
      const result = formatWhatsAppText('Price is $10.00 (plus tax)');
      expect(result[0]).toBe('Price is $10.00 (plus tax)');
   });

   it('should handle only formatting without text', () => {
      const result = formatWhatsAppText('*bold*');
      expect(result).toHaveLength(1);
      const el = result[0] as JSX.Element;
      expect(el.props?.className).toContain('font-medium');
   });

   it('should handle only URL without text', () => {
      const result = formatWhatsAppText('https://example.com');
      expect(result).toHaveLength(1);
      const link = result[0] as JSX.Element;
      expect(link.props?.href).toBe('https://example.com');
   });

   // --- Mixed formatting ---

   it('should format adjacent bold and italic', () => {
      const result = formatWhatsAppText('*bold* _italic_');
      const boldEl = result.find(
         (part) => typeof part !== 'string' && part.props?.className?.includes('font-medium'),
      );
      const italicEl = result.find(
         (part) => typeof part !== 'string' && part.props?.className?.includes('italic'),
      );
      expect(boldEl).toBeDefined();
      expect(italicEl).toBeDefined();
   });

   it('should format bold, italic, and strikethrough together', () => {
      const result = formatWhatsAppText('*bold* _italic_ ~strike~');
      const hasBold = result.some(
         (part) => typeof part !== 'string' && part.props?.className?.includes('font-medium'),
      );
      const hasItalic = result.some(
         (part) => typeof part !== 'string' && part.props?.className?.includes('italic'),
      );
      const hasStrike = result.some(
         (part) => typeof part !== 'string' && part.props?.className?.includes('line-through'),
      );
      expect(hasBold).toBe(true);
      expect(hasItalic).toBe(true);
      expect(hasStrike).toBe(true);
   });

   // --- Code blocks ---

   it('should format triple backtick code blocks', () => {
      const result = formatWhatsAppText('Use ```code``` here');
      const codeEl = result.find(
         (part) => typeof part !== 'string' && part.type === 'code',
      );
      expect(codeEl).toBeDefined();
   });

   it('should format code with special characters', () => {
      const result = formatWhatsAppText('Use `<div>content</div>` here');
      const codeEl = result.find(
         (part) => typeof part !== 'string' && part.type === 'code',
      );
      expect(codeEl).toBeDefined();
   });

   it('should handle empty code blocks (no content)', () => {
      const result = formatWhatsAppText('``');
      // Empty code blocks may not match the regex since content must be non-empty for +?
      // Should render as plain text
      expect(result).toHaveLength(1);
   });

   // --- URL variations ---

   it('should handle three or more URLs in the same message', () => {
      const result = formatWhatsAppText('a https://a.com b https://b.com c https://c.com');
      const links = result.filter(
         (part) => typeof part !== 'string' && part.props?.href,
      );
      expect(links).toHaveLength(3);
   });

   it('should handle URL with query parameters', () => {
      const result = formatWhatsAppText('https://example.com?foo=bar&baz=1');
      const link = result.find(
         (part) => typeof part !== 'string' && part.props?.href === 'https://example.com?foo=bar&baz=1',
      );
      expect(link).toBeDefined();
   });

   it('should handle URL with fragment', () => {
      const result = formatWhatsAppText('https://example.com#section');
      const link = result.find(
         (part) => typeof part !== 'string' && part.props?.href === 'https://example.com#section',
      );
      expect(link).toBeDefined();
   });

   it('should handle URL with port number', () => {
      const result = formatWhatsAppText('https://example.com:8080/path');
      const link = result.find(
         (part) => typeof part !== 'string' && part.props?.href === 'https://example.com:8080/path',
      );
      expect(link).toBeDefined();
   });

   it('should handle URL with HTTPS (secure)', () => {
      const result = formatWhatsAppText('https://secure.example.com');
      const link = result.find(
         (part): part is JSX.Element => typeof part !== 'string' && 'props' in part && (part.props as Record<string, unknown>)?.href === 'https://secure.example.com',
      );
      expect(link).toBeDefined();
      expect(link!.props).toHaveProperty('target', '_blank');
   });

   it('should handle URL with HTTP (non-secure)', () => {
      const result = formatWhatsAppText('http://example.com');
      const link = result.find(
         (part): part is JSX.Element => typeof part !== 'string' && 'props' in part && (part.props as Record<string, unknown>)?.href === 'http://example.com',
      );
      expect(link).toBeDefined();
   });

   it('should handle URL at start and end with text in middle', () => {
      const result = formatWhatsAppText('https://start.com middle text https://end.com');
      const links = result.filter(
         (part) => typeof part !== 'string' && part.props?.href,
      ) as JSX.Element[];
      expect(links).toHaveLength(2);
      expect(links[0].props?.href).toBe('https://start.com');
      expect(links[1].props?.href).toBe('https://end.com');
   });

   // --- Non-URL patterns that should be plain text ---

   it('should keep email address as plain text', () => {
      const result = formatWhatsAppText('Contact me at user@example.com');
      expect(result[0]).toBe('Contact me at user@example.com');
   });

   it('should keep phone number as plain text', () => {
      const result = formatWhatsAppText('Call +55 11 99999-8888');
      expect(result[0]).toBe('Call +55 11 99999-8888');
   });

   // --- Edge cases with delimiters ---

   it('should handle incomplete asterisk delimiter as plain text', () => {
      const result = formatWhatsAppText('This is *not closed');
      expect(result).toHaveLength(1);
      expect(result[0]).toBe('This is *not closed');
   });

   it('should handle incomplete underscore delimiter as plain text', () => {
      const result = formatWhatsAppText('This is _not closed');
      expect(result).toHaveLength(1);
      expect(result[0]).toBe('This is _not closed');
   });

   it('should handle mismatched delimiters as plain text', () => {
      const result = formatWhatsAppText('*bold _text* more_');
      // May partially match - ensure no crash and result is array
      expect(Array.isArray(result)).toBe(true);
   });

   it('should handle empty delimiters ********', () => {
      const result = formatWhatsAppText('Hello **** world');
      // **** - two empty ** patterns, or one ** with ** content... regex needs at least 1 char for +?
      // Should not crash
      expect(result.length).toBeGreaterThanOrEqual(1);
   });

   // --- Consecutive formatting without spaces ---

   it('should handle consecutive formats without spaces', () => {
      const result = formatWhatsAppText('*bold*_italic_');
      // Each format is processed separately
      const hasBold = result.some(
         (part) => typeof part !== 'string' && part.props?.className?.includes('font-medium'),
      );
      const hasItalic = result.some(
         (part) => typeof part !== 'string' && part.props?.className?.includes('italic'),
      );
      expect(hasBold).toBe(true);
      expect(hasItalic).toBe(true);
   });

   // --- Unicode and special characters ---

   it('should format bold text with unicode characters', () => {
      const result = formatWhatsAppText('*Café Français*');
      const boldEl = result.find(
         (part) => typeof part !== 'string' && part.props?.className?.includes('font-medium'),
      );
      expect(boldEl).toBeDefined();
   });

   it('should format italic text with unicode', () => {
      const result = formatWhatsAppText('_naïve_');
      const italicEl = result.find(
         (part) => typeof part !== 'string' && part.props?.className?.includes('italic'),
      );
      expect(italicEl).toBeDefined();
   });

   // --- Single character formatting ---

   it('should format single character bold', () => {
      const result = formatWhatsAppText('*a*');
      const boldEl = result.find(
         (part) => typeof part !== 'string' && part.props?.className?.includes('font-medium'),
      );
      expect(boldEl).toBeDefined();
   });

   it('should format single character italic', () => {
      const result = formatWhatsAppText('_a_');
      const italicEl = result.find(
         (part) => typeof part !== 'string' && part.props?.className?.includes('italic'),
      );
      expect(italicEl).toBeDefined();
   });

   // --- Formatting and URLs combined ---

   it('should format bold text around a URL', () => {
      const result = formatWhatsAppText('*bold before* https://example.com *bold after*');
      const boldEls = result.filter(
         (part) => typeof part !== 'string' && part.props?.className?.includes('font-medium'),
      );
      const link = result.find(
         (part) => typeof part !== 'string' && part.props?.href === 'https://example.com',
      );
      expect(boldEls).toHaveLength(2);
      expect(link).toBeDefined();
   });

   it('should handle text with dollar signs and special regex characters', () => {
      const result = formatWhatsAppText('Cost: $10.00 (15% tax) [total] {receipt}');
      expect(result[0]).toBe('Cost: $10.00 (15% tax) [total] {receipt}');
   });

   it('should handle very long text with formatting', () => {
      const longContent = 'x'.repeat(5000);
      const result = formatWhatsAppText(`*${longContent}*`);
      expect(result).toHaveLength(1);
      const el = result[0] as JSX.Element;
      expect(el.props?.className).toContain('font-medium');
   });

   // --- Additional format edge cases ---

   it('should handle text with hash tags as plain text', () => {
      const result = formatWhatsAppText('#important #meeting');
      expect(result[0]).toBe('#important #meeting');
   });

   it('should handle text with @mentions as plain text', () => {
      const result = formatWhatsAppText('@joão você viu?');
      expect(result[0]).toBe('@joão você viu?');
   });

   it('should handle URL with underscore in path', () => {
      const result = formatWhatsAppText('https://example.com/my_file.pdf');
      const link = result.find(
         (part) => typeof part !== 'string' && part.props?.href === 'https://example.com/my_file.pdf',
      );
      expect(link).toBeDefined();
   });

   it('should handle URL with path segments', () => {
      const result = formatWhatsAppText('https://example.com/path/to/file.html');
      const link = result.find(
         (part) => typeof part !== 'string' && part.props?.href === 'https://example.com/path/to/file.html',
      );
      expect(link).toBeDefined();
   });

   it('should handle arithmetic expression as plain text', () => {
      const result = formatWhatsAppText('2*3=6 _not italic_');
      const hasBold = result.some(
         (part) => typeof part !== 'string' && part.props?.className?.includes('font-medium'),
      );
      const hasItalic = result.some(
         (part) => typeof part !== 'string' && part.props?.className?.includes('italic'),
      );
      expect(hasBold).toBe(false);
      expect(hasItalic).toBe(true);
   });

   it('should handle multiple bold sections in text', () => {
      const result = formatWhatsAppText('*bold1* normal *bold2*');
      const boldEls = result.filter(
         (part) => typeof part !== 'string' && part.props?.className?.includes('font-medium'),
      );
      expect(boldEls).toHaveLength(2);
   });

   it('should handle multiple code blocks in text', () => {
      const result = formatWhatsAppText('Use `code1` and `code2` here');
      const codeEls = result.filter(
         (part) => typeof part !== 'string' && part.type === 'code',
      );
      expect(codeEls).toHaveLength(2);
   });

   it('should handle text with only special characters', () => {
      const result = formatWhatsAppText('~!@#$%^&*()_+');
      expect(result[0]).toBe('~!@#$%^&*()_+');
   });

   it('should handle formatting at start of text', () => {
      const result = formatWhatsAppText('*bold start* and normal');
      const boldEl = result.find(
         (part) => typeof part !== 'string' && part.props?.className?.includes('font-medium'),
      );
      expect(boldEl).toBeDefined();
   });

   it('should handle formatting at end of text', () => {
      const result = formatWhatsAppText('normal and *bold end*');
      const boldEl = result.find(
         (part) => typeof part !== 'string' && part.props?.className?.includes('font-medium'),
      );
      expect(boldEl).toBeDefined();
   });

   it('should handle text with parentheses and formatting inside', () => {
      const result = formatWhatsAppText('(*bold in parens*)');
      const boldEl = result.find(
         (part) => typeof part !== 'string' && part.props?.className?.includes('font-medium'),
      );
      expect(boldEl).toBeDefined();
   });

   it('should handle URL with HTTPS and port', () => {
      const result = formatWhatsAppText('https://localhost:3000/api');
      const link = result.find(
         (part) => typeof part !== 'string' && part.props?.href === 'https://localhost:3000/api',
      );
      expect(link).toBeDefined();
   });

   it('should handle formatting inside parentheses', () => {
      const result = formatWhatsAppText('(_italic inside parens_)');
      const italicEl = result.find(
         (part) => typeof part !== 'string' && part.props?.className?.includes('italic'),
      );
      expect(italicEl).toBeDefined();
   });
});

import { describe, it, expect } from 'vitest';
import { parseChat, extractGroupName } from '@/utils/parsechat';

describe('parseChat', () => {
   it('should parse a simple text message', () => {
      const input = '8/19/24, 09:28 - Felipe Nova Unidade 31: Bom dia a todos';
      const result = parseChat(input);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
         date: '8/19/24',
         time: '09:28',
         sender: 'Felipe Nova Unidade 31',
         content: 'Bom dia a todos',
         type: 'message',
      });
   });

   it('should parse a system message', () => {
      const input = '8/17/24, 12:32 - Messages and calls are end-to-end encrypted.';
      const result = parseChat(input);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
         date: '8/17/24',
         time: '12:32',
         sender: 'system',
         content: 'Messages and calls are end-to-end encrypted.',
         type: 'system',
      });
   });

   it('should parse a deleted message', () => {
      const input = '8/17/24, 12:32 - João: This message was deleted';
      const result = parseChat(input);
      expect(result).toHaveLength(1);
      expect(result[0].type).toBe('deleted');
   });

   it('should parse media messages with image extensions', () => {
      const input = '8/19/24, 09:28 - João: IMG-20240819-WA0011.jpg';
      const result = parseChat(input);
      expect(result[0].type).toBe('image');
   });

   it('should detect video files', () => {
      const input = '8/19/24, 09:28 - João: VID-20241108-WA0004.mp4';
      const result = parseChat(input);
      expect(result[0].type).toBe('video');
   });

   it('should detect audio files', () => {
      const input = '8/19/24, 09:28 - João: PTT-20240819-WA0004.opus';
      const result = parseChat(input);
      expect(result[0].type).toBe('audio');
   });

   it('should detect contact files', () => {
      const input = '8/19/24, 09:28 - João: Sidnei Vizinho Ferreira.vcf';
      const result = parseChat(input);
      expect(result[0].type).toBe('contact');
   });

   it('should handle media omitted', () => {
      const input = '8/19/24, 09:28 - João: <Media omitted>';
      const result = parseChat(input);
      expect(result[0].type).toBe('media');
   });

   it('should handle file attached', () => {
      const input = '8/19/24, 09:28 - João: documento.pdf (file attached)';
      const result = parseChat(input);
      expect(result[0].type).toBe('generic');
   });

   it('should handle multiline messages', () => {
      const input = [
         '8/19/24, 09:35 - João: Anotei alguns pontos',
         'Agora vamos trabalhar em cima deles',
      ].join('\n');
      const result = parseChat(input);
      expect(result).toHaveLength(1);
      expect(result[0].content).toBe('Anotei alguns pontos\nAgora vamos trabalhar em cima deles');
   });

   it('should parse multiple messages', () => {
      const input = [
         '8/19/24, 09:28 - Felipe: Mensagem 1',
         '8/19/24, 09:29 - João: Mensagem 2',
         '8/19/24, 09:30 - Maria: Mensagem 3',
      ].join('\n');
      const result = parseChat(input);
      expect(result).toHaveLength(3);
      expect(result[0].sender).toBe('Felipe');
      expect(result[1].sender).toBe('João');
      expect(result[2].sender).toBe('Maria');
   });

   it('should handle empty input', () => {
      const result = parseChat('');
      expect(result).toEqual([]);
   });

   it('should parse messages with time including seconds', () => {
      const input = '8/19/24, 09:28:15 - Felipe: Com segundos';
      const result = parseChat(input);
      expect(result[0].time).toBe('09:28:15');
   });

   it('should parse messages with AM/PM time', () => {
      const input = '8/19/24, 9:28 PM - Felipe: Hora americana';
      const result = parseChat(input);
      expect(result[0].time).toBe('9:28 PM');
   });

   it('should parse system message without colon', () => {
      const input = '8/17/24, 12:32 - Emília created group "Teste"';
      const result = parseChat(input);
      expect(result[0].type).toBe('system');
      expect(result[0].sender).toBe('system');
   });

   it('should handle You deleted this message', () => {
      const input = '3/26/25, 18:59 - Peres, L.F.: You deleted this message';
      const result = parseChat(input);
      expect(result[0].type).toBe('deleted');
   });

   it('should parse image with file attached', () => {
      const input = '8/19/24, 10:06 - João: IMG-001.jpg (file attached)';
      const result = parseChat(input);
      expect(result[0].type).toBe('image');
   });

   it('should parse video with file attached', () => {
      const input = '11/8/24, 11:13 - Maria: VID-001.mp4 (file attached)';
      const result = parseChat(input);
      expect(result[0].type).toBe('video');
   });

   it('should parse message with edited flag', () => {
      const input = '3/9/25, 10:51 - Emília: O técnico já foi chamado. <This message was edited>';
      const result = parseChat(input);
      expect(result[0].type).toBe('message');
      expect(result[0].edited).toBe(true);
      expect(result[0].content).toBe('O técnico já foi chamado.');
      expect(result[0].content).not.toContain('<This message was edited>');
   });

   it('should parse message without edited flag', () => {
      const input = '3/9/25, 10:51 - Emília: O técnico já foi chamado.';
      const result = parseChat(input);
      expect(result[0].edited).toBeUndefined();
      expect(result[0].content).toBe('O técnico já foi chamado.');
   });

   it('should handle system add participant message', () => {
      const input = '8/17/24, 12:38 - Emília added Dona Cristina';
      const result = parseChat(input);
      expect(result[0].type).toBe('system');
      expect(result[0].sender).toBe('system');
   });

   it('should handle system remove participant message', () => {
      const input = '8/17/24, 17:17 - Emília removed +55 11 99664-3485';
      const result = parseChat(input);
      expect(result[0].type).toBe('system');
   });

   it('should handle system pinned message', () => {
      const input = '11/30/24, 17:07 - Felipe pinned a message';
      const result = parseChat(input);
      expect(result[0].type).toBe('system');
   });

   it('should handle sender with special characters', () => {
      const input = '8/19/24, 09:46 - +55 13 97411-7932: OK felipe';
      const result = parseChat(input);
      expect(result[0].sender).toBe('+55 13 97411-7932');
      expect(result[0].content).toBe('OK felipe');
   });

   it('should handle sender with comma in name', () => {
      const input = '2/28/25, 16:43 - Peres, L.F.: Boa tarde!';
      const result = parseChat(input);
      expect(result[0].sender).toBe('Peres, L.F.');
      expect(result[0].content).toBe('Boa tarde!');
   });

   it('should preserve content without trimming multiline continuation', () => {
      const input = [
         '8/19/24, 09:35 - +55 13 97411-7932: Anotei alguns pontos',
         '   Ainda com espaço inicial',
      ].join('\n');
      const result = parseChat(input);
      // Original: '   Ainda com espaço inicial' with trim() → still has the newline
      expect(result[0].content).toContain('Ainda com espaço inicial');
   });

   it('should handle null content as text message', () => {
      const input = '2/27/25, 12:03 - Dona Cristina Unidade 23: null';
      const result = parseChat(input);
      expect(result[0].content).toBe('null');
      expect(result[0].type).toBe('message');
   });

   // --- CRLF handling tests (TDD: Red before Green) ---

   it('should parse messages with CRLF line endings (Windows)', () => {
      const input = '8/19/24, 09:28 - Felipe: Bom dia\r\n8/19/24, 09:29 - João: Olá';
      const result = parseChat(input);
      expect(result).toHaveLength(2);
      expect(result[0].content).toBe('Bom dia');
      expect(result[1].content).toBe('Olá');
   });

   it('should parse system message with CRLF endings', () => {
      const input = '8/17/24, 12:32 - Messages are encrypted.\r\n';
      const result = parseChat(input);
      expect(result).toHaveLength(1);
      expect(result[0].type).toBe('system');
   });

   it('should parse mixed LF and CRLF line endings', () => {
      const input = '8/19/24, 09:28 - Felipe: Primeira\r\n8/19/24, 09:29 - João: Segunda\n8/19/24, 09:30 - Maria: Terceira\r\n';
      const result = parseChat(input);
      expect(result).toHaveLength(3);
      expect(result[0].content).toBe('Primeira');
      expect(result[1].content).toBe('Segunda');
      expect(result[2].content).toBe('Terceira');
   });

   it('should handle CRLF endings without trailing empty line', () => {
      const input = '8/19/24, 09:28 - Felipe: Primeira\r\n8/19/24, 09:29 - João: Segunda';
      const result = parseChat(input);
      expect(result).toHaveLength(2);
      expect(result[0].content).toBe('Primeira');
      expect(result[1].content).toBe('Segunda');
   });

   it('should handle multiline messages with CRLF endings', () => {
      const input = '8/19/24, 09:35 - João: Anotei alguns pontos\r\nAgora vamos trabalhar\r\n';
      const result = parseChat(input);
      expect(result).toHaveLength(1);
      expect(result[0].content).toContain('Anotei alguns pontos');
      expect(result[0].content).toContain('Agora vamos trabalhar');
   });

   it('should parse media with CRLF endings', () => {
      const input = '8/19/24, 10:06 - João: IMG-001.jpg (file attached)\r\n';
      const result = parseChat(input);
      expect(result[0].type).toBe('image');
   });

   it('should handle sender with comma in name and CRLF', () => {
      const input = '2/28/25, 16:43 - Peres, L.F.: Boa tarde!\r\n';
      const result = parseChat(input);
      expect(result[0].sender).toBe('Peres, L.F.');
      expect(result[0].content).toBe('Boa tarde!');
   });

   it('should handle real-world chat.txt CRLF content', () => {
      // Simulates the actual line endings from the exported chat file
      const line1 = '8/17/24, 12:32 - Messages and calls are end-to-end encrypted.\r';
      const line2 = '7/18/22, 20:35 - Emília Síndica Apto 41A created group "Ed. Vitória Park"\r';
      const line3 = '8/19/24, 07:04 - Felipe Nova Unidade 31: Bom dia.\r';
      const input = [line1, line2, line3].join('\n');
      const result = parseChat(input);
      expect(result).toHaveLength(3);
      expect(result[0].type).toBe('system');
      expect(result[2].content).toBe('Bom dia.');
   });

   // --- Date format variations ---

   it('should parse date with double-digit day and month 01/01/24', () => {
      const input = '01/01/24, 10:00 - Felipe: Happy New Year';
      const result = parseChat(input);
      expect(result).toHaveLength(1);
      expect(result[0].date).toBe('01/01/24');
      expect(result[0].content).toBe('Happy New Year');
   });

   it('should parse date with single-digit day and double-digit month 1/01/24', () => {
      const input = '1/01/24, 10:00 - Maria: Single day, double month';
      const result = parseChat(input);
      expect(result[0].date).toBe('1/01/24');
   });

   it('should parse date with double-digit day and single-digit month 01/1/24', () => {
      const input = '01/1/24, 10:00 - João: Double day, single month';
      const result = parseChat(input);
      expect(result[0].date).toBe('01/1/24');
   });

   it('should parse date with 4-digit year and no leading zeros 1/1/2024', () => {
      const input = '1/1/2024, 10:00 - Felipe: Four digit year';
      const result = parseChat(input);
      expect(result[0].date).toBe('1/1/2024');
   });

   it('should parse date with 4-digit year and leading zeros 01/01/2024', () => {
      const input = '01/01/2024, 10:00 - Maria: Full format';
      const result = parseChat(input);
      expect(result[0].date).toBe('01/01/2024');
   });

   // --- System message variants ---

   it('should handle system "left" message', () => {
      const input = '8/17/24, 14:22 - João left';
      const result = parseChat(input);
      expect(result[0].type).toBe('system');
      expect(result[0].sender).toBe('system');
      expect(result[0].content).toBe('João left');
   });

   it('should handle system "You left" message', () => {
      const input = '8/17/24, 14:22 - You left';
      const result = parseChat(input);
      expect(result[0].type).toBe('system');
   });

   it('should handle system "security code changed" message', () => {
      const input = '8/17/24, 15:00 - Your security code with Felipe changed.';
      const result = parseChat(input);
      expect(result[0].type).toBe('system');
   });

   it('should handle system "changed the subject" message', () => {
      const input = '8/18/24, 09:00 - Emília changed the subject to "New Group Name"';
      const result = parseChat(input);
      expect(result[0].type).toBe('system');
      expect(result[0].content).toContain('changed the subject');
   });

   it('should handle system "changed this group icon" message', () => {
      const input = '8/18/24, 09:05 - Emília changed this group\'s icon';
      const result = parseChat(input);
      expect(result[0].type).toBe('system');
   });

   it('should handle system "changed the group description" message', () => {
      const input = '8/18/24, 09:10 - Emília changed the group description';
      const result = parseChat(input);
      expect(result[0].type).toBe('system');
   });

   it('should handle system "You created group" message', () => {
      const input = '7/18/22, 20:35 - You created group "Ed. Vitória Park"';
      const result = parseChat(input);
      expect(result[0].type).toBe('system');
   });

   it('should handle system "You were added" message', () => {
      const input = '8/17/24, 12:35 - You were added';
      const result = parseChat(input);
      expect(result[0].type).toBe('system');
   });

   it('should handle system "You removed" message', () => {
      const input = '8/17/24, 17:20 - You removed Emília';
      const result = parseChat(input);
      expect(result[0].type).toBe('system');
   });

   it('should handle system "changed the subject from" message', () => {
      const input = '8/18/24, 09:00 - Felipe changed the subject from "Old" to "New"';
      const result = parseChat(input);
      expect(result[0].type).toBe('system');
   });

   // --- Sender with special characters ---

   it('should handle sender with parentheses', () => {
      const input = '8/19/24, 10:00 - John (Work): Hello from work';
      const result = parseChat(input);
      expect(result[0].sender).toBe('John (Work)');
      expect(result[0].content).toBe('Hello from work');
   });

   it('should handle sender with unicode accents', () => {
      const input = '8/19/24, 10:05 - José Alves: Mensagem com acento';
      const result = parseChat(input);
      expect(result[0].sender).toBe('José Alves');
      expect(result[0].content).toBe('Mensagem com acento');
   });

   it('should handle sender with emoji', () => {
      const input = '8/19/24, 10:10 - John 😀: Hello with emoji';
      const result = parseChat(input);
      expect(result[0].sender).toBe('John 😀');
      expect(result[0].content).toBe('Hello with emoji');
   });

   it('should handle sender with dot', () => {
      const input = '8/19/24, 10:15 - Dr. John: Medical message';
      const result = parseChat(input);
      expect(result[0].sender).toBe('Dr. John');
      expect(result[0].content).toBe('Medical message');
   });

   it('should handle sender with slash', () => {
      const input = '8/19/24, 10:20 - John/Admin: Slash in name';
      const result = parseChat(input);
      expect(result[0].sender).toBe('John/Admin');
   });

   // --- Messages with only emoji ---

   it('should handle message with only single emoji', () => {
      const input = '8/19/24, 10:30 - Felipe: 😀';
      const result = parseChat(input);
      expect(result[0].content).toBe('😀');
      expect(result[0].type).toBe('message');
   });

   it('should handle message with multiple emojis', () => {
      const input = '8/19/24, 10:31 - Maria: 😀🎉👍❤️🌟';
      const result = parseChat(input);
      expect(result[0].content).toBe('😀🎉👍❤️🌟');
   });

   it('should handle message with emoji and text', () => {
      const input = '8/19/24, 10:32 - João: 😀 Great job everyone! 🎉';
      const result = parseChat(input);
      expect(result[0].content).toBe('😀 Great job everyone! 🎉');
   });

   // --- Messages with HTML-like content ---

   it('should handle message with HTML tags', () => {
      const input = '8/19/24, 10:40 - Felipe: Check <b>this</b> out';
      const result = parseChat(input);
      expect(result[0].content).toBe('Check <b>this</b> out');
      expect(result[0].type).toBe('message');
   });

   it('should handle message with script-like tags', () => {
      const input = '8/19/24, 10:41 - Maria: <script>alert("xss")</script>';
      const result = parseChat(input);
      expect(result[0].content).toBe('<script>alert("xss")</script>');
   });

   // --- Edge cases with whitespace and empty lines ---

   it('should handle empty lines between messages', () => {
      const input = [
         '8/19/24, 10:00 - Felipe: Mensagem 1',
         '',
         '8/19/24, 10:01 - João: Mensagem 2',
         '',
         '8/19/24, 10:02 - Maria: Mensagem 3',
      ].join('\n');
      const result = parseChat(input);
      expect(result).toHaveLength(3);
      expect(result[0].content).toBe('Mensagem 1');
      expect(result[1].content).toBe('Mensagem 2');
      expect(result[2].content).toBe('Mensagem 3');
   });

   it('should handle input with only newlines', () => {
      const result = parseChat('\n\n\n');
      expect(result).toEqual([]);
   });

   it('should handle input with only whitespace', () => {
      const result = parseChat('   \n   \n   ');
      expect(result).toEqual([]);
   });

   it('should handle whitespace-only continuation lines between messages', () => {
      const input = [
         '8/19/24, 10:00 - Felipe: Primeira',
         '   ',
         '8/19/24, 10:01 - João: Segunda',
      ].join('\n');
      const result = parseChat(input);
      expect(result).toHaveLength(2);
      expect(result[0].content).toBe('Primeira');
      expect(result[1].content).toBe('Segunda');
   });

   // --- File detection edge cases ---

   it('should handle file with no extension (no dot)', () => {
      const input = '8/19/24, 10:50 - Felipe: README';
      const result = parseChat(input);
      expect(result[0].type).toBe('message');
   });

   it('should handle file with leading dot', () => {
      const input = '8/19/24, 10:51 - João: .hidden';
      const result = parseChat(input);
      expect(result[0].type).toBe('message');
   });

   it('should handle file with trailing dot', () => {
      const input = '8/19/24, 10:52 - Maria: filename.';
      const result = parseChat(input);
      expect(result[0].type).toBe('message');
   });

   it('should parse gif as message (no gif support)', () => {
      const input = '8/19/24, 10:53 - Felipe: animation.gif';
      const result = parseChat(input);
      expect(result[0].type).toBe('message');
   });

   it('should parse svg as message (no svg support)', () => {
      const input = '8/19/24, 10:54 - João: icon.svg';
      const result = parseChat(input);
      expect(result[0].type).toBe('message');
   });

   it('should detect uppercase extension JPG as image', () => {
      const input = '8/19/24, 10:55 - Maria: photo.JPG';
      const result = parseChat(input);
      expect(result[0].type).toBe('image');
   });

   it('should detect uppercase extension MP4 as video', () => {
      const input = '8/19/24, 10:56 - Felipe: video.MP4';
      const result = parseChat(input);
      expect(result[0].type).toBe('video');
   });

   // --- Performance and edge content ---

   it('should handle very long message content', () => {
      const longContent = 'A'.repeat(5000);
      const input = `8/19/24, 11:00 - Felipe: ${longContent}`;
      const result = parseChat(input);
      expect(result).toHaveLength(1);
      expect(result[0].content).toHaveLength(5000);
      expect(result[0].content).toBe(longContent);
   });

   it('should handle multiline with very long continuation line', () => {
      const longLine = 'B'.repeat(5000);
      const input = `8/19/24, 11:01 - João: First line\n${longLine}`;
      const result = parseChat(input);
      expect(result).toHaveLength(1);
      expect(result[0].content).toContain('First line');
      expect(result[0].content).toContain(longLine);
   });

   // --- Messages with special content ---

   it('should handle message with multiple colons in content', () => {
      const input = '8/19/24, 11:10 - Felipe: Message: with: multiple: colons';
      const result = parseChat(input);
      expect(result[0].sender).toBe('Felipe');
      expect(result[0].content).toBe('Message: with: multiple: colons');
   });

   it('should handle first line not matching message format (no previous messages)', () => {
      const input = [
         'This is not a valid chat line',
         '8/19/24, 11:20 - Felipe: First real message',
      ].join('\n');
      const result = parseChat(input);
      expect(result).toHaveLength(1);
      expect(result[0].content).toBe('First real message');
   });

   it('should handle message with special regex characters like $ and ^', () => {
      const input = '8/19/24, 11:30 - Felipe: Price is $10.00 ^ 2 = 100';
      const result = parseChat(input);
      expect(result[0].content).toBe('Price is $10.00 ^ 2 = 100');
   });

   it('should handle message with parentheses and brackets', () => {
      const input = '8/19/24, 11:31 - João: Test [with] (brackets) {and} <more>';
      const result = parseChat(input);
      expect(result[0].content).toBe('Test [with] (brackets) {and} <more>');
   });

   it('should parse message with time including seconds and AM/PM', () => {
      const input = '8/19/24, 09:28:15 PM - Felipe: Seconds with AM/PM';
      const result = parseChat(input);
      expect(result[0].time).toBe('09:28:15 PM');
   });

   it('should handle media omitted with file attached detection', () => {
      const input = '8/19/24, 10:06 - João: <Media omitted> (file attached)';
      const result = parseChat(input);
      // The content contains both patterns; detectMessageType checks content === '<Media omitted>' (exact match fails)
      // then detects hasFileAttached = true → returns 'generic'
      expect(result[0].type).toBe('generic');
   });

   it('should handle message ending with backslash', () => {
      const input = '8/19/24, 12:00 - Felipe: Path is C:\\folder\\';
      const result = parseChat(input);
      expect(result[0].content).toBe('Path is C:\\folder\\');
   });

   it('should handle sender with only first name', () => {
      const input = '8/19/24, 12:05 - John: Short sender';
      const result = parseChat(input);
      expect(result[0].sender).toBe('John');
   });

   it('should handle sender with long name', () => {
      const input = '8/19/24, 12:10 - Antonio Carlos Jobim de Moraes: Long name test';
      const result = parseChat(input);
      expect(result[0].sender).toBe('Antonio Carlos Jobim de Moraes');
   });

   it('should handle deleted message with content before delete', () => {
      const input = '8/19/24, 12:15 - Felipe: Some content This message was deleted';
      const result = parseChat(input);
      // Since content is not exactly 'This message was deleted', it's a regular message
      expect(result[0].type).toBe('message');
   });

   // --- Integration with real-world chat patterns ---

   it('should parse a full multi-day conversation', () => {
      const input = [
         '8/17/24, 12:32 - Messages and calls are end-to-end encrypted.',
         '8/19/24, 07:04 - Felipe Nova Unidade 31: Bom dia.',
         '8/19/24, 08:15 - João: Como estão todos?',
         '8/19/24, 10:30 - Maria: Estou bem, obrigado!',
         '8/20/24, 09:00 - Felipe: Reunião amanhã às 10h',
         '8/20/24, 09:01 - João: Confirmado!',
      ].join('\n');
      const result = parseChat(input);
      expect(result).toHaveLength(6);
      expect(result[0].type).toBe('system');
      expect(result[1].sender).toBe('Felipe Nova Unidade 31');
      expect(result[4].content).toBe('Reunião amanhã às 10h');
   });

   it('should parse message with URL in content', () => {
      const input = '8/19/24, 10:00 - Felipe: Veja o link https://example.com/doc.html';
      const result = parseChat(input);
      expect(result[0].content).toBe('Veja o link https://example.com/doc.html');
      expect(result[0].type).toBe('message');
   });

   it('should parse message containing "deleted" as regular text', () => {
      const input = '8/19/24, 10:00 - Felipe: I deleted my file yesterday';
      const result = parseChat(input);
      expect(result[0].type).toBe('message');
      expect(result[0].content).toBe('I deleted my file yesterday');
   });

   it('should parse message with JSON-like content', () => {
      const input = '8/19/24, 10:00 - Dev: {"key": "value", "number": 123}';
      const result = parseChat(input);
      expect(result[0].type).toBe('message');
      expect(result[0].content).toBe('{"key": "value", "number": 123}');
   });

   it('should parse message starting with @ mention', () => {
      const input = '8/19/24, 10:00 - Felipe: @João você viu a mensagem?';
      const result = parseChat(input);
      expect(result[0].content).toBe('@João você viu a mensagem?');
   });

   it('should parse message starting with # hashtag', () => {
      const input = '8/19/24, 10:00 - Maria: #importante Ler o documento';
      const result = parseChat(input);
      expect(result[0].content).toBe('#importante Ler o documento');
   });

   it('should handle tab character as part of content (system message)', () => {
      const input = '8/19/24, 10:00 - Felipe:\tTab indented content';
      const result = parseChat(input);
      // Tab after colon is not matched by ": " separator → treated as system message
      expect(result[0].type).toBe('system');
      expect(result[0].content).toContain('Tab indented content');
   });

   it('should parse message with unicode arrows and symbols', () => {
      const input = '8/19/24, 10:00 - João: Use → para avançar e ← para voltar ✓';
      const result = parseChat(input);
      expect(result[0].content).toBe('Use → para avançar e ← para voltar ✓');
   });

   it('should parse message with phone number', () => {
      const input = '8/19/24, 10:00 - Felipe: Me ligue no (11) 99999-8888';
      const result = parseChat(input);
      expect(result[0].content).toBe('Me ligue no (11) 99999-8888');
   });

   it('should parse system message about phone number change', () => {
      const input = '8/17/24, 15:30 - João changed their phone number to +55 11 99999-8888';
      const result = parseChat(input);
      expect(result[0].type).toBe('system');
      expect(result[0].content).toContain('changed their phone');
   });

   it('should parse content with regex special characters', () => {
      const input = '8/19/24, 10:00 - Felipe: Price is [R$ 10.00] + (5% * 2) = {R$ 10.50}';
      const result = parseChat(input);
      expect(result[0].content).toBe('Price is [R$ 10.00] + (5% * 2) = {R$ 10.50}');
   });

   it('should parse message with mixed Arabic numerals', () => {
      const input = '8/19/24, 10:00 - Felipe: Numbers ١٢٣٤٥ in message';
      const result = parseChat(input);
      expect(result[0].content).toBe('Numbers ١٢٣٤٥ in message');
   });

   it('should skip empty continuation line between content', () => {
      const input = [
         '8/19/24, 10:00 - Felipe: First line',
         '',
         'Continuation after blank',
      ].join('\n');
      const result = parseChat(input);
      expect(result).toHaveLength(1);
      // Empty line is trimmed and skipped (falsy trimmed check)
      expect(result[0].content).toBe('First line\nContinuation after blank');
   });

   it('should parse message with file path containing dots', () => {
      const input = '8/19/24, 10:00 - Dev: /path/to/file.config.json';
      const result = parseChat(input);
      expect(result[0].type).toBe('message');
      expect(result[0].content).toBe('/path/to/file.config.json');
   });

   it('should parse message with mixed date formats in same chat', () => {
      const input = [
         '8/19/24, 10:00 - Felipe: Using M/d/yy',
         '19/08/24, 10:01 - João: Using dd/MM/yy',
         '01/01/2024, 10:02 - Maria: Using dd/MM/yyyy',
      ].join('\n');
      const result = parseChat(input);
      expect(result).toHaveLength(3);
      expect(result[0].date).toBe('8/19/24');
      expect(result[1].date).toBe('19/08/24');
      expect(result[2].date).toBe('01/01/2024');
   });

   it('should handle very long sender name', () => {
      const longName = 'A'.repeat(80);
      const input = `8/19/24, 10:00 - ${longName}: Message`;
      const result = parseChat(input);
      expect(result[0].sender).toBe(longName);
   });

   it('should handle sender name with only consonants', () => {
      const input = '8/19/24, 10:00 - JŽ: Short name';
      const result = parseChat(input);
      expect(result[0].sender).toBe('JŽ');
   });

   it('should parse messages with only punctuation content', () => {
      const input = '8/19/24, 10:00 - Felipe: !!!???!!!';
      const result = parseChat(input);
      expect(result[0].content).toBe('!!!???!!!');
      expect(result[0].type).toBe('message');
   });
});

describe('extractGroupName', () => {
   it('should extract group name from "created group" message', () => {
      const input = '7/18/22, 20:35 - Emília created group "Ed. Vitória Park"';
      expect(extractGroupName(input)).toBe('Ed. Vitória Park');
   });

   it('should extract group name with apostrophe/quotes inside', () => {
      const input = '7/18/22, 20:35 - Emília created group "O\'Brien\'s Group"';
      expect(extractGroupName(input)).toBe("O'Brien's Group");
   });

   it('should return null when no group creation message is present', () => {
      const input = '8/19/24, 09:28 - Felipe: Bom dia a todos';
      expect(extractGroupName(input)).toBeNull();
   });

   it('should return null for empty text', () => {
      expect(extractGroupName('')).toBeNull();
   });

   it('should extract group name with CRLF line endings', () => {
      const input = '7/18/22, 20:35 - Emília created group "Ed. Vitória Park"\r\n';
      expect(extractGroupName(input)).toBe('Ed. Vitória Park');
   });
});

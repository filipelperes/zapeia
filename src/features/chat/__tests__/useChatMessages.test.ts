import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useChatMessages } from '@/features/chat/hooks/useChatMessages';

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

describe('useChatMessages', () => {
   beforeEach(() => {
      mockFetch.mockReset();
   });

   afterEach(() => {
      vi.clearAllMocks();
   });

   it('should start with loading state', () => {
      mockFetch.mockImplementationOnce(() => new Promise(() => {}));
      const { result } = renderHook(() => useChatMessages('/test.txt'));
      expect(result.current.isLoading).toBe(true);
      expect(result.current.messages).toEqual([]);
      expect(result.current.error).toBeNull();
      expect(result.current.notFound).toBe(false);
   });

   it('should parse chat file on success', async () => {
      const chatText = '8/19/24, 09:28 - Felipe: Hello';
      mockFetch.mockResolvedValueOnce({
         ok: true,
         text: () => Promise.resolve(chatText),
      });

      const { result } = renderHook(() => useChatMessages('/test.txt'));

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.messages).toHaveLength(1);
      expect(result.current.messages[0].content).toBe('Hello');
      expect(result.current.error).toBeNull();
      expect(result.current.notFound).toBe(false);
   });

   it('should handle fetch error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useChatMessages('/test.txt'));

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.messages).toEqual([]);
      expect(result.current.error).toBeDefined();
   });

   it('should handle non-ok response', async () => {
      mockFetch.mockResolvedValueOnce({
         ok: false,
         statusText: 'Not Found',
      });

      const { result } = renderHook(() => useChatMessages('/test.txt'));

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.error).toBeDefined();
   });

   it('should handle unknown errors', async () => {
      mockFetch.mockRejectedValueOnce('string error');

      const { result } = renderHook(() => useChatMessages('/test.txt'));

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.error).toBeDefined();
   });

   it('should parse multiple messages', async () => {
      const chatText = [
         '8/19/24, 09:28 - Felipe: Hello',
         '8/19/24, 09:29 - João: Hi',
      ].join('\n');

      mockFetch.mockResolvedValueOnce({
         ok: true,
         text: () => Promise.resolve(chatText),
      });

      const { result } = renderHook(() => useChatMessages('/test.txt'));

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.messages).toHaveLength(2);
   });

   it('should parse system messages', async () => {
      const chatText = '8/17/24, 12:32 - Messages are encrypted.';
      mockFetch.mockResolvedValueOnce({
         ok: true,
         text: () => Promise.resolve(chatText),
      });

      const { result } = renderHook(() => useChatMessages('/test.txt'));

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.messages[0].type).toBe('system');
   });

   it('should cancel request on unmount', async () => {
      mockFetch.mockImplementationOnce(
         () => new Promise((resolve) => setTimeout(() => {
            resolve({ ok: true, text: () => Promise.resolve('test') });
         }, 1000)),
      );

      const { result, unmount } = renderHook(() => useChatMessages('/test.txt'));
      unmount();

      // Should not throw or update state after unmount
      await new Promise((r) => setTimeout(r, 100));
      expect(result.current.isLoading).toBe(true);
   });

   it('should re-fetch when file path changes', async () => {
      mockFetch.mockResolvedValue({
         ok: true,
         text: () => Promise.resolve('8/19/24, 09:28 - Felipe: Hello'),
      });

      const { result, rerender } = renderHook(
         (path: string) => useChatMessages(path),
         { initialProps: '/chat1.txt' },
      );

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      rerender('/chat2.txt');

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(mockFetch).toHaveBeenCalledTimes(2);
   });

   it('should not re-fetch when same path is used on re-render', async () => {
      mockFetch.mockResolvedValue({
         ok: true,
         text: () => Promise.resolve('8/19/24, 09:28 - Felipe: Hello'),
      });

      const { result, rerender } = renderHook(
         (path: string) => useChatMessages(path),
         { initialProps: '/test.txt' },
      );

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      mockFetch.mockClear();
      rerender('/test.txt');

      // Wait a tick to ensure no fetch is triggered
      await new Promise((r) => setTimeout(r, 50));
      expect(mockFetch).not.toHaveBeenCalled();
   });

   it('should handle empty chat text', async () => {
      mockFetch.mockResolvedValueOnce({
         ok: true,
         text: () => Promise.resolve(''),
      });

      const { result } = renderHook(() => useChatMessages('/test.txt'));

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.messages).toEqual([]);
      expect(result.current.error).toBeNull();
   });

   it('should reset loading to true when re-fetching', async () => {
      let resolveFetch!: (value: unknown) => void;
      const fetchPromise = new Promise((resolve) => { resolveFetch = resolve; });

      mockFetch
         .mockReturnValueOnce(fetchPromise)
         .mockReturnValueOnce(Promise.resolve({
            ok: true,
            text: () => Promise.resolve('8/19/24, 09:28 - Felipe: Hello'),
         }));

      const { result, rerender } = renderHook(
         (path: string) => useChatMessages(path),
         { initialProps: '/chat1.txt' },
      );

      expect(result.current.isLoading).toBe(true);

      // Resolve first fetch
      resolveFetch({ ok: true, text: () => Promise.resolve('8/19/24, 09:28 - Felipe: Hello') });
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      rerender('/chat2.txt');
      expect(result.current.isLoading).toBe(true);
   });

   it('should reset error on new fetch', async () => {
      mockFetch
         .mockRejectedValueOnce(new Error('First error'))
         .mockResolvedValueOnce({
            ok: true,
            text: () => Promise.resolve('8/19/24, 09:28 - Felipe: Hello'),
         });

      const { result, rerender } = renderHook(
         (path: string) => useChatMessages(path),
         { initialProps: '/fail.txt' },
      );

      await waitFor(() => expect(result.current.error).toBeDefined());

      rerender('/success.txt');
      await waitFor(() => expect(result.current.error).toBeNull());
   });

   it('should not update state after unmount if fetch completes', async () => {
      let resolveFetch!: (value: unknown) => void;
      const fetchPromise = new Promise((resolve) => { resolveFetch = resolve; });

      mockFetch.mockReturnValueOnce(fetchPromise);

      const { result, unmount } = renderHook(() => useChatMessages('/test.txt'));

      unmount();

      // Resolve after unmount
      resolveFetch({ ok: true, text: () => Promise.resolve('8/19/24, 09:28 - Felipe: Hello') });

      // Wait for the promise to resolve
      await new Promise((r) => setTimeout(r, 50));

      // State should remain unchanged (loading from initial)
      expect(result.current.isLoading).toBe(true);
      expect(result.current.messages).toEqual([]);
   });

   it('should handle multiple rapid path changes', async () => {
      mockFetch.mockResolvedValue({
         ok: true,
         text: () => Promise.resolve('8/19/24, 09:28 - Felipe: Hello'),
      });

      const { result, rerender } = renderHook(
         (path: string) => useChatMessages(path),
         { initialProps: '/chat1.txt' },
      );

      // Rapidly change path multiple times
      rerender('/chat2.txt');
      rerender('/chat3.txt');
      rerender('/chat4.txt');

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.messages).toHaveLength(1);
      expect(result.current.messages[0].content).toBe('Hello');
   });

   it('should handle fetch with special characters in path', async () => {
      mockFetch.mockResolvedValueOnce({
         ok: true,
         text: () => Promise.resolve('8/19/24, 09:28 - Felipe: Hello'),
      });

      const { result } = renderHook(() => useChatMessages('/path/with spaces/file.txt'));

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.messages).toHaveLength(1);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/path/with spaces/file.txt'),
      );
   });

   it('should handle AbortError like any other error', async () => {
      // DOMException is not instanceof Error in jsdom, so the hook wraps it with "Unknown error"
       const abortError = new DOMException('The operation was aborted', 'AbortError');
       mockFetch.mockRejectedValueOnce(abortError);

       const { result } = renderHook(() => useChatMessages('/test.txt'));

       await waitFor(() => expect(result.current.isLoading).toBe(false));

       expect(result.current.messages).toEqual([]);
       // DOMException is not instanceof Error in jsdom → falls to "Unknown error"
       expect(result.current.error).toBeDefined();
       expect(result.current.error?.message).toBe('Unknown error');
   });

   it('should handle HTTP 500 server error', async () => {
      mockFetch.mockResolvedValueOnce({
         ok: false,
         status: 500,
         statusText: 'Internal Server Error',
      });

      const { result } = renderHook(() => useChatMessages('/test.txt'));

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.error).toBeDefined();
      expect(result.current.error?.message).toContain('Internal Server Error');
   });

   it('should set notFound on HTTP 404', async () => {
      mockFetch.mockResolvedValueOnce({
         ok: false,
         status: 404,
         statusText: 'Not Found',
      });

      const { result } = renderHook(() => useChatMessages('/missing.txt'));

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.notFound).toBe(true);
      expect(result.current.error).toBeNull();
      expect(result.current.messages).toEqual([]);
   });

   it('should handle network error without message property', async () => {
      mockFetch.mockRejectedValueOnce(null);

      const { result } = renderHook(() => useChatMessages('/test.txt'));

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.error).toBeDefined();
       expect(result.current.error?.message).toBe('Unknown error');
    });

    it('should handle consecutive errors', async () => {
      mockFetch
         .mockRejectedValueOnce(new Error('First error'))
         .mockRejectedValueOnce(new Error('Second error'));

      const { result, rerender } = renderHook(
         (path: string) => useChatMessages(path),
         { initialProps: '/fail1.txt' },
      );

      await waitFor(() => {
         expect(result.current.error).toBeDefined();
         expect(result.current.error?.message).toBe('First error');
      });

      rerender('/fail2.txt');

      // Loading state becomes true immediately, error resets to null
      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
         expect(result.current.error).toBeDefined();
         expect(result.current.error?.message).toBe('Second error');
      });
   });

   it('should change path before first fetch completes', async () => {
      let resolveFirst!: (value: unknown) => void;
      const firstPromise = new Promise((resolve) => { resolveFirst = resolve; });

      mockFetch
         .mockReturnValueOnce(firstPromise)
         .mockReturnValueOnce(Promise.resolve({
            ok: true,
            text: () => Promise.resolve('8/19/24, 09:28 - Felipe: Second chat'),
         }));

      const { result, rerender } = renderHook(
         (path: string) => useChatMessages(path),
         { initialProps: '/chat1.txt' },
      );

      // Change path before first resolves
      rerender('/chat2.txt');
      resolveFirst({ ok: true, text: () => Promise.resolve('8/19/24, 09:28 - Felipe: First chat') });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      // Should have resolved with second chat (the latest path)
      expect(result.current.messages[0].content).toBe('Second chat');
   });

   it('should not re-fetch on re-render with same path', async () => {
      mockFetch.mockResolvedValue({
         ok: true,
         text: () => Promise.resolve('8/19/24, 09:28 - Felipe: Hello'),
      });

      const { result, rerender } = renderHook(
         (path: string) => useChatMessages(path),
         { initialProps: '/test.txt' },
      );

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      mockFetch.mockClear();
      rerender('/test.txt');
      await new Promise((r) => setTimeout(r, 50));
      expect(mockFetch).not.toHaveBeenCalled();
   });

   it('should handle empty string path gracefully', async () => {
      mockFetch.mockResolvedValueOnce({
         ok: true,
         text: () => Promise.resolve('8/19/24, 09:28 - Felipe: Hello'),
      });

      const { result } = renderHook(() => useChatMessages(''));

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      // The empty path gets ?_t=... appended; just ensure it was called
      expect(mockFetch).toHaveBeenCalledOnce();
      expect(result.current.messages).toHaveLength(1);
   });

   it('should handle very large chat text', async () => {
      const longContent = 'A'.repeat(10000);
      const chatText = `8/19/24, 09:28 - Felipe: ${longContent}`;

      mockFetch.mockResolvedValueOnce({
         ok: true,
         text: () => Promise.resolve(chatText),
      });

      const { result } = renderHook(() => useChatMessages('/large.txt'));

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.messages).toHaveLength(1);
      expect(result.current.messages[0].content).toHaveLength(10000);
   });

   it('should handle error recovery (error then success)', async () => {
      mockFetch
         .mockRejectedValueOnce(new Error('First error'))
         .mockResolvedValueOnce({
            ok: true,
            text: () => Promise.resolve('8/19/24, 09:28 - Felipe: Recovery'),
         });

      const { result, rerender } = renderHook(
         (path: string) => useChatMessages(path),
         { initialProps: '/fail.txt' },
      );

      await waitFor(() => expect(result.current.error).toBeDefined());

      rerender('/success.txt');
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.error).toBeNull();
      expect(result.current.messages[0].content).toBe('Recovery');
   });

   it('should handle success then error transition', async () => {
      mockFetch
         .mockResolvedValueOnce({
            ok: true,
            text: () => Promise.resolve('8/19/24, 09:28 - Felipe: First'),
         })
         .mockRejectedValueOnce(new Error('Second error'));

      const { result, rerender } = renderHook(
         (path: string) => useChatMessages(path),
         { initialProps: '/good.txt' },
      );

      await waitFor(() => {
         expect(result.current.isLoading).toBe(false);
         expect(result.current.messages[0].content).toBe('First');
      });

      rerender('/bad.txt');

      await waitFor(() => {
         expect(result.current.error).toBeDefined();
         expect(result.current.error?.message).toBe('Second error');
      });
   });

   it('should transition loading state correctly', async () => {
      mockFetch.mockResolvedValueOnce({
         ok: true,
         text: () => Promise.resolve('8/19/24, 09:28 - Felipe: Hello'),
      });

      const { result } = renderHook(() => useChatMessages('/test.txt'));

      expect(result.current.isLoading).toBe(true);
      expect(result.current.messages).toEqual([]);
      expect(result.current.error).toBeNull();

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.messages).toHaveLength(1);
      expect(result.current.error).toBeNull();
   });

   it('should call console.error when fetch fails', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockFetch.mockRejectedValueOnce(new Error('Test error'));

      const { result } = renderHook(() => useChatMessages('/test.txt'));

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
   });

   it('should not set state after unmount on successful fetch', async () => {
      let resolveFetch!: (value: unknown) => void;
      const fetchPromise = new Promise((resolve) => { resolveFetch = resolve; });

      mockFetch.mockReturnValueOnce(fetchPromise);

      const { result, unmount } = renderHook(() => useChatMessages('/test.txt'));

      unmount();
      resolveFetch({ ok: true, text: () => Promise.resolve('8/19/24, 09:28 - Felipe: Hello') });

      // Wait for promise to resolve
      await new Promise((r) => setTimeout(r, 50));

      // State should remain unchanged
      expect(result.current.isLoading).toBe(true);
   });

   it('should call fetch with exact path provided', async () => {
      mockFetch.mockResolvedValueOnce({
         ok: true,
         text: () => Promise.resolve('8/19/24, 09:28 - Felipe: Hello'),
      });

      renderHook(() => useChatMessages('/custom/path/chat.txt'));

      await vi.waitFor(() => {
         expect(mockFetch).toHaveBeenCalledWith(
            expect.stringContaining('/custom/path/chat.txt'),
         );
      });
   });

   it('should handle fetch with query parameters in path', async () => {
      mockFetch.mockResolvedValueOnce({
         ok: true,
         text: () => Promise.resolve('8/19/24, 09:28 - Felipe: Hello'),
      });

      const { result } = renderHook(() => useChatMessages('/chat.txt?v=2'));

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(mockFetch).toHaveBeenCalledWith(
         expect.stringContaining('/chat.txt?v=2'),
      );
      expect(result.current.messages).toHaveLength(1);
   });
});

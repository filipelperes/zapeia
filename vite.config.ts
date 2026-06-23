import { defineConfig } from 'vitest/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  server: {
    open: false,
  },
  resolve: {
    alias: [
      {
        find: /^@\/(.+)/,
        replacement: path.resolve(__dirname, 'src/$1'),
      },
    ],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    css: true,
    setupFiles: ['./src/test-setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
});

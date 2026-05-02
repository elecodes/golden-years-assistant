import { defineConfig, globalSetup } from 'vitest/config';
import react from '@vitejs/plugin-react';

const globalSetup = () => {
  return () => {
    if (typeof globalThis.crypto === 'undefined' || !globalThis.crypto.getRandomValues) {
      Object.defineProperty(globalThis, 'crypto', {
        value: {
          getRandomValues: (arr: Uint8Array) => {
            for (let i = 0; i < arr.length; i++) {
              arr[i] = Math.floor(Math.random() * 256);
            }
            return arr;
          },
        },
        writable: true,
      });
    }
  };
};

export default defineConfig({
  plugins: [react()],
  test: {
    globalSetup,
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: [
        'node_modules/',
        'src/main.tsx',
        'src/App.tsx',
        'src/App.css',
        'src/index.css',
        'src/vite-env.d.ts',
        'src/test/**',
        'src/monitoring/**',
        '*.config.*',
      ],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
});

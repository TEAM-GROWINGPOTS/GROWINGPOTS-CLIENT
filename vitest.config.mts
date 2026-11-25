import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

const TEST_ORIGIN = 'http://localhost:3000';

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: 'jsdom',
    environmentOptions: {
      jsdom: { url: TEST_ORIGIN },
    },
    env: {
      NEXT_PUBLIC_API_BASE_URL: TEST_ORIGIN,
    },
    include: ['src/**/*.test.{ts,tsx}'],
    setupFiles: ['./src/shared/test/setup.ts'],
    clearMocks: true,
    // zustand 내부의 zustand/vanilla import에도 setup.ts의 mock이 적용되도록 변환 대상에 넣는다.
    server: { deps: { inline: ['zustand'] } },
  },
});

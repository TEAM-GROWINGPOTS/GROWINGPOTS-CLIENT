import '@testing-library/jest-dom/vitest';

import { useAuthStore } from '@shared/stores/auth-store';
import { useSideNavigationStore } from '@shared/stores/side-navigation-store';
import { server } from '@shared/test/msw/server';
import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';

vi.mock('next/navigation', () => {
  const router = {
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  };
  const searchParams = new URLSearchParams();

  return {
    useRouter: () => router,
    usePathname: () => '/',
    useSearchParams: () => searchParams,
    redirect: vi.fn(),
    notFound: vi.fn(),
  };
});

vi.mock('lottie-react', () => ({ default: () => null }));

// Testing Library는 전역 beforeAll이 있을 때만 이 값을 켜는데, 이 레포는 vitest globals를 쓰지 않는다.
vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);

// `// @vitest-environment node` 테스트에는 window와 Element가 없다.
if (typeof window !== 'undefined') {
  class ObserverStub {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
    takeRecords = () => [];
  }

  vi.stubGlobal('ResizeObserver', ObserverStub);
  vi.stubGlobal('IntersectionObserver', ObserverStub);
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
  Element.prototype.scrollIntoView = vi.fn();
}

beforeAll(() => server.listen({ onUnhandledFrame: 'error' }));

afterAll(() => server.close());

afterEach(() => {
  cleanup();
  server.resetHandlers();
  server.events.removeAllListeners();
  useAuthStore.setState(useAuthStore.getInitialState(), true);
  useSideNavigationStore.setState(useSideNavigationStore.getInitialState(), true);
});

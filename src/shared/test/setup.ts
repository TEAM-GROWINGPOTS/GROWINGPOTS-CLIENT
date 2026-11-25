import '@testing-library/jest-dom/vitest';

import { server } from '@shared/test/msw/server';
import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';
import type { StateCreator } from 'zustand/vanilla';

const { storeResetFns } = vi.hoisted(() => ({ storeResetFns: new Set<() => void>() }));

// 모든 store를 만들어질 때 등록해 두고 테스트마다 초기 상태로 되돌린다. 새 store도 따로 등록할 필요가 없다.
// zustand의 create도 내부에서 createStore를 쓰므로 createStore만 감싸면 두 방식이 모두 잡힌다.
vi.mock('zustand/vanilla', async (importOriginal) => {
  const actual = await importOriginal<typeof import('zustand/vanilla')>();

  const createResettableStore = <T>(stateCreator: StateCreator<T>) => {
    const store = actual.createStore(stateCreator);
    const initialState = store.getInitialState();
    storeResetFns.add(() => store.setState(initialState, true));
    return store;
  };

  return {
    ...actual,
    createStore: (<T>(stateCreator?: StateCreator<T>) =>
      stateCreator ? createResettableStore(stateCreator) : createResettableStore) as typeof actual.createStore,
  };
});

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
  storeResetFns.forEach((resetStore) => resetStore());
});

import { useAuthStore } from '@shared/stores/auth-store';
import { describe, expect, it } from 'vitest';
import { create, createStore } from 'zustand';
import { createStore as createVanillaStore } from 'zustand/vanilla';

interface CounterState {
  count: number;
  increase: () => void;
}

const createCounter = (set: (fn: (state: CounterState) => Partial<CounterState>) => void): CounterState => ({
  count: 0,
  increase: () => set(({ count }) => ({ count: count + 1 })),
});

const useCounterStore = create<CounterState>(createCounter);
const useCurriedStore = create<CounterState>()(createCounter);
const counterStore = createStore<CounterState>(createCounter);
const vanillaCounterStore = createVanillaStore<CounterState>(createCounter);

describe('setup의 Zustand store 초기화', () => {
  it('테스트 안에서는 store 상태가 바뀐다', () => {
    useAuthStore.getState().setUnauthenticated();
    useCounterStore.getState().increase();
    useCurriedStore.getState().increase();
    counterStore.getState().increase();
    vanillaCounterStore.getState().increase();

    expect(useAuthStore.getState().status).toBe('unauthenticated');
    expect(useCounterStore.getState().count).toBe(1);
    expect(useCurriedStore.getState().count).toBe(1);
    expect(counterStore.getState().count).toBe(1);
    expect(vanillaCounterStore.getState().count).toBe(1);
  });

  it('다음 테스트에서는 기존 store와 새로 만든 store 모두 초기 상태로 돌아온다', () => {
    expect(useAuthStore.getState().status).toBe('initializing');
    expect(useCounterStore.getState().count).toBe(0);
    expect(useCurriedStore.getState().count).toBe(0);
    expect(counterStore.getState().count).toBe(0);
    expect(vanillaCounterStore.getState().count).toBe(0);
  });
});

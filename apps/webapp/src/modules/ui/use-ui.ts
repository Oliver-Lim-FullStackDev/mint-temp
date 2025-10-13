'use client';

import { useUIStore } from './ui-store';

export function useUI() {
  const state = useUIStore();

  if (!state) {
    throw new Error('useUI must be used in a client component');
  }

  return state;
}

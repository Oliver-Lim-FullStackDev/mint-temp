import type { ReactNode } from 'react';
import type { UIState } from './ui-store';

/**
 * UIProvider is SSR-safe
 */
export function UIProvider({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: Partial<UIState>;
}) {
  // If you want to preload state from server props via cookies or URL,
  // inject it via `initialState` and call useUIStore().setInitialState() client-side.

  return <>{children}</>;
}

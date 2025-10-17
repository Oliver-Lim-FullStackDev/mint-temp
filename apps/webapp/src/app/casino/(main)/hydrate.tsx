'use client';

import type { PropsWithChildren } from 'react';
import type { DehydratedState } from '@tanstack/react-query';
import { HydrationBoundary } from '@tanstack/react-query';

export type CasinoHydrationBoundaryProps = PropsWithChildren<{ state: DehydratedState }>;

export function CasinoHydrationBoundary({ state, children }: CasinoHydrationBoundaryProps) {
  return <HydrationBoundary state={state}>{children}</HydrationBoundary>;
}

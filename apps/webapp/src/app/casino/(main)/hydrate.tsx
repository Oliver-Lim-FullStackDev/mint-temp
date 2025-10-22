'use client';

import { useState, type PropsWithChildren } from 'react';
import { HydrationBoundary, QueryClient, QueryClientProvider, type DehydratedState } from '@tanstack/react-query';

export type CasinoHydrationBoundaryProps = PropsWithChildren<{ state: DehydratedState }>;

export function CasinoHydrationBoundary({ state, children }: CasinoHydrationBoundaryProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={state}>{children}</HydrationBoundary>
    </QueryClientProvider>
  );
}

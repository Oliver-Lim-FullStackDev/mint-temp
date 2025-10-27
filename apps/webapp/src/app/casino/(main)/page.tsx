import type { Metadata } from 'next';
import { CasinoView } from 'src/app/casino/(main)/view';
import { loadGamesInitialData } from 'src/app/casino/(main)/loader';
import { CasinoHydrationBoundary } from 'src/app/casino/(main)/hydrate';

export const metadata: Metadata = {
  title: 'Mint.io | Casinos',
  description: '...',
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const { filters, dehydratedState, hasError, syncUrl } = await loadGamesInitialData({
    searchParams: resolvedSearchParams,
  });

  return (
    <CasinoHydrationBoundary state={dehydratedState}>
      <CasinoView initialFilters={filters} hasError={hasError} pendingUrlSync={syncUrl} />
    </CasinoHydrationBoundary>
  );
}




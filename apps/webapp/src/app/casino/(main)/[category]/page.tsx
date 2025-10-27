import { CasinoView } from 'src/app/casino/(main)/view';
import { loadGamesInitialData } from 'src/app/casino/(main)/loader';
import { CasinoHydrationBoundary } from 'src/app/casino/(main)/hydrate';

type PageProps = {
  params: Promise<{ category: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ params, searchParams }: PageProps) {
  const [{ category }, resolvedSearchParams] = await Promise.all([params, searchParams]);
  const { filters, dehydratedState, hasError, syncUrl } = await loadGamesInitialData({
    category,
    searchParams: resolvedSearchParams,
  });

  return (
    <CasinoHydrationBoundary state={dehydratedState}>
      <CasinoView initialFilters={filters} hasError={hasError} pendingUrlSync={syncUrl} />
    </CasinoHydrationBoundary>
  );
}

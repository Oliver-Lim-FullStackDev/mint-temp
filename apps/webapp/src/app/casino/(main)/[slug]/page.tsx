import { CasinoView } from '@/app/casino/(main)/view';
import { loadCasinoInitialData } from '@/app/casino/(main)/loader';
import { CasinoHydrationBoundary } from '@/app/casino/(main)/hydrate';

type PageProps = {
  params: { slug: string };
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ params, searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const { filters, dehydratedState, hasError, syncUrl } = await loadCasinoInitialData({
    category: params.slug,
    searchParams: resolvedSearchParams,
  });

  return (
    <CasinoHydrationBoundary state={dehydratedState}>
      <CasinoView initialFilters={filters} hasError={hasError} pendingUrlSync={syncUrl} />
    </CasinoHydrationBoundary>
  );
}

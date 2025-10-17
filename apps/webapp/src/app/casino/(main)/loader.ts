import { cookies } from 'next/headers';
import { dehydrate, QueryClient, type DehydratedState } from '@tanstack/react-query';

import {
  type CasinoFilters,
  type CasinoQueryKey,
  type CasinoQueryParams,
  buildCasinoQuery,
  fetchCasinoGames,
} from '@/modules/casino';
import { DEFAULT_FILTERS, normaliseCategory, sanitiseOrder } from '@/modules/casino/state/utils';

import { CASINO_ORDER_COOKIE, CASINO_PROVIDER_COOKIE } from './preferences';

type LoadParams = {
  category?: string;
  searchParams: Record<string, string | string[] | undefined>;
};

export type CasinoInitialData = {
  filters: CasinoFilters;
  queryParams: CasinoQueryParams;
  dehydratedState: DehydratedState;
  hasError: boolean;
  syncUrl: {
    provider: boolean;
    order: boolean;
  };
};

function normaliseParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value ?? undefined;
}

export async function loadCasinoInitialData({ category, searchParams }: LoadParams): Promise<CasinoInitialData> {
  const cookieStore = await cookies();

  const cookieProvider = cookieStore.get(CASINO_PROVIDER_COOKIE)?.value;
  const cookieOrder = cookieStore.get(CASINO_ORDER_COOKIE)?.value;

  const search = normaliseParam(searchParams.q)?.trim() ?? DEFAULT_FILTERS.search;

  const providerParam = normaliseParam(searchParams.provider);
  const providerFromCookie = !providerParam && cookieProvider ? cookieProvider : undefined;
  const provider = providerParam ?? providerFromCookie ?? DEFAULT_FILTERS.provider;

  const orderParam = normaliseParam(searchParams.order);
  const resolvedOrderSource = orderParam ?? cookieOrder ?? DEFAULT_FILTERS.order;
  const order = sanitiseOrder(resolvedOrderSource);

  const shouldSyncProvider = Boolean(providerFromCookie);
  const shouldSyncOrder = !orderParam && Boolean(cookieOrder) && order !== DEFAULT_FILTERS.order;
  const resolvedCategory = normaliseCategory(category);

  const filters: CasinoFilters = {
    category: resolvedCategory,
    search,
    provider,
    order,
  };

  const queryParams = buildCasinoQuery(filters);

  const queryClient = new QueryClient();
  let hasError = false;

  const queryKey: CasinoQueryKey = ['games', queryParams];

  try {
    await queryClient.prefetchQuery({
      queryKey,
      queryFn: () => fetchCasinoGames(queryParams),
      staleTime: 30_000,
    });
  } catch (error) {
    hasError = true;
    console.error('Failed to prefetch casino games', error);
  }

  return {
    filters,
    queryParams,
    dehydratedState: dehydrate(queryClient),
    hasError,
    syncUrl: {
      provider: shouldSyncProvider && provider.length > 0,
      order: shouldSyncOrder,
    },
  };
}

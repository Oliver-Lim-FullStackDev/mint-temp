import { cookies } from 'next/headers';
import { dehydrate, QueryClient, type DehydratedState } from '@tanstack/react-query';

import {
  type GamesFilters,
  type GamesQueryKey,
  type GamesQueryParams,
  buildGamesQuery,
  fetchGames,
} from 'src/modules/games';
import { DEFAULT_FILTERS, normaliseCategory, sanitiseOrder } from 'src/modules/games/state/utils';

import { GAMES_ORDER_COOKIE, GAMES_PROVIDER_COOKIE } from './preferences';

type LoadParams = {
  category?: string;
  searchParams: Record<string, string | string[] | undefined>;
};

export type GamesInitialData = {
  filters: GamesFilters;
  queryParams: GamesQueryParams;
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

export async function loadGamesInitialData({
  category,
  searchParams,
}: LoadParams): Promise<GamesInitialData> {
  const cookieStore = await cookies();

  const cookieProvider = cookieStore.get(GAMES_PROVIDER_COOKIE)?.value;
  const cookieOrder = cookieStore.get(GAMES_ORDER_COOKIE)?.value;

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

  const filters: GamesFilters = {
    category: resolvedCategory,
    search,
    provider,
    order,
  };

  const queryParams = buildGamesQuery(filters);

  const queryClient = new QueryClient();
  let hasError = false;

  const queryKey: GamesQueryKey = ['games', queryParams];

  try {
    await queryClient.prefetchQuery({
      queryKey,
      queryFn: () => fetchGames(queryParams),
      staleTime: 30_000,
    });
  } catch (error) {
    hasError = true;
    console.error('Failed to prefetch games', error);
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

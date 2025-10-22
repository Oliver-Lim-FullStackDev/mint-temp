'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
  startTransition,
} from 'react';
import {
  usePathname,
  useRouter,
  useSearchParams,
  type ReadonlyURLSearchParams,
} from 'next/navigation';
import { useStore } from 'zustand';
import { createStore, type StoreApi } from 'zustand/vanilla';

import type { GamesFilters, GamesSortOrder } from '../filters.types';
import {
  DEFAULT_FILTERS,
  areFiltersEqual,
  deriveCategoryFromPath,
  normaliseCategory,
  sanitiseOrder,
} from './utils';
import { paths } from '@/routes/paths';
import { rememberGamesOrder, rememberGamesProvider } from '@/app/casino/(main)/actions';

type GamesFiltersState = {
  filters: GamesFilters;
  defaults: GamesFilters;
  setFilters: (filters: GamesFilters) => GamesFilters;
  syncInitialFilters: (filters: GamesFilters) => void;
  setSearch: (value: string) => GamesFilters;
  setProvider: (value: string) => GamesFilters;
  setOrder: (value: GamesSortOrder) => GamesFilters;
  setCategory: (value: string) => GamesFilters;
  resetFilters: () => GamesFilters;
};

type GamesFiltersStore = StoreApi<GamesFiltersState>;

function createGamesFiltersStore(initialFilters: GamesFilters) {
  const defaults = {
    ...DEFAULT_FILTERS,
    category: normaliseCategory(initialFilters.category ?? DEFAULT_FILTERS.category),
  };

  return createStore<GamesFiltersState>()((set, get) => ({
    filters: initialFilters,
    defaults,
    setFilters: (next) => {
      const current = get().filters;
      if (areFiltersEqual(current, next)) {
        return current;
      }

      set({ filters: next });
      return next;
    },
    syncInitialFilters: (next) => {
      set(({ defaults: currentDefaults }) => ({
        defaults: {
          ...currentDefaults,
          ...DEFAULT_FILTERS,
          category: normaliseCategory(next.category ?? DEFAULT_FILTERS.category),
        },
      }));

      get().setFilters(next);
    },
    setSearch: (value) => {
      const current = get().filters;
      const trimmed = value.trim();

      if (current.search.trim() === trimmed) {
        return current;
      }

      const next = mergeFilters(current, { search: trimmed });
      return get().setFilters(next);
    },
    setProvider: (value) => {
      const current = get().filters;
      if (current.provider === value) {
        return current;
      }

      const next = mergeFilters(current, { provider: value });
      return get().setFilters(next);
    },
    setOrder: (value) => {
      const current = get().filters;
      if (current.order === value) {
        return current;
      }

      const next = mergeFilters(current, { order: value });
      return get().setFilters(next);
    },
    setCategory: (value) => {
      const current = get().filters;
      if (normaliseCategory(value) === current.category) {
        return current;
      }

      const next = mergeFilters(current, { category: value });
      return get().setFilters(next);
    },
    resetFilters: () => {
      const { defaults: baseDefaults, filters: current } = get();
      const next = mergeFilters(current, {
        search: baseDefaults.search,
        provider: baseDefaults.provider,
        order: baseDefaults.order,
      });

      return get().setFilters(next);
    },
  }));
}

const GamesFiltersContext = createContext<GamesFiltersStore | null>(null);

export function GamesFiltersProvider({
  initialFilters,
  children,
}: {
  initialFilters: GamesFilters;
  children: ReactNode;
}) {
  const storeRef = useRef<GamesFiltersStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = createGamesFiltersStore(initialFilters);
  }

  const store = storeRef.current;

  useEffect(() => {
    store?.getState().syncInitialFilters(initialFilters);
  }, [initialFilters, store]);

  return (
    <GamesFiltersContext.Provider value={store!}>
      {children}
    </GamesFiltersContext.Provider>
  );
}

export function useGamesFiltersStore() {
  const store = useContext(GamesFiltersContext);

  if (!store) {
    throw new Error('useGamesFiltersStore must be used within GamesFiltersProvider');
  }

  return store;
}

function deriveFiltersFromLocation(
  pathname: string,
  searchParams: ReadonlyURLSearchParams,
): GamesFilters {
  const search = searchParams.get('q')?.trim() ?? DEFAULT_FILTERS.search;
  const provider = searchParams.get('provider') ?? DEFAULT_FILTERS.provider;
  const order = sanitiseOrder(searchParams.get('order'));

  return {
    category: deriveCategoryFromPath(pathname),
    search,
    provider,
    order,
  };
}

export function GamesFiltersHydrator({ initialFilters }: { initialFilters: GamesFilters }) {
  const store = useGamesFiltersStore();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialisedRef = useRef(false);

  const searchKey = useMemo(() => searchParams.toString(), [searchParams]);

  useEffect(() => {
    const nextFilters = initialisedRef.current
      ? deriveFiltersFromLocation(pathname, searchParams)
      : initialFilters;

    initialisedRef.current = true;
    store.getState().setFilters(nextFilters);
  }, [initialFilters, pathname, searchKey, searchParams, store]);

  return null;
}

function buildUrlForFilters(filters: GamesFilters) {
  const params = new URLSearchParams();

  if (filters.search.trim()) {
    params.set('q', filters.search.trim());
  }

  if (filters.order !== DEFAULT_FILTERS.order) {
    params.set('order', filters.order);
  }

  if (filters.provider) {
    params.set('provider', filters.provider);
  }

  const basePath =
    filters.category && filters.category !== DEFAULT_FILTERS.category
      ? `${paths.casino.root}/${filters.category}`
      : paths.casino.root;

  const query = params.toString();

  return query ? `${basePath}?${query}` : basePath;
}

function mergeFilters(current: GamesFilters, patch: Partial<GamesFilters>): GamesFilters {
  return {
    category: normaliseCategory(patch.category ?? current.category),
    search:
      patch.search !== undefined
        ? patch.search.trim()
        : current.search.trim(),
    provider: patch.provider ?? current.provider,
    order: sanitiseOrder(patch.order ?? current.order),
  };
}

export function useGamesFilters() {
  const store = useGamesFiltersStore();
  const router = useRouter();
  const filters = useStore(store, (state) => state.filters);
  const defaults = useStore(store, (state) => state.defaults);

  const updateUrl = useCallback(
    (nextFilters: GamesFilters) => {
      const url = buildUrlForFilters(nextFilters);
      router.replace(url, { scroll: false });
    },
    [router],
  );

  const setSearch = useCallback(
    (value: string) => {
      const previousFilters = store.getState().filters;
      const nextFilters = store.getState().setSearch(value);

      if (nextFilters === previousFilters) {
        return;
      }

      updateUrl(nextFilters);
    },
    [store, updateUrl],
  );

  const setProvider = useCallback(
    (value: string) => {
      const previousFilters = store.getState().filters;
      const nextFilters = store.getState().setProvider(value);

      if (nextFilters === previousFilters) {
        return;
      }

      updateUrl(nextFilters);
      startTransition(() => {
        void rememberGamesProvider(value);
      });
    },
    [store, updateUrl],
  );

  const setOrder = useCallback(
    (value: GamesSortOrder) => {
      const previousFilters = store.getState().filters;
      const nextFilters = store.getState().setOrder(value);

      if (nextFilters === previousFilters) {
        return;
      }

      updateUrl(nextFilters);
      startTransition(() => {
        void rememberGamesOrder(value);
      });
    },
    [store, updateUrl],
  );

  const setCategory = useCallback(
    (value: string) => {
      const previousFilters = store.getState().filters;
      const nextFilters = store.getState().setCategory(value);

      if (nextFilters === previousFilters) {
        return;
      }

      updateUrl(nextFilters);
    },
    [store, updateUrl],
  );

  const reset = useCallback(() => {
    const previousFilters = store.getState().filters;
    const nextFilters = store.getState().resetFilters();

    if (nextFilters === previousFilters) {
      return;
    }

    updateUrl(nextFilters);
  }, [store, updateUrl]);

  return {
    filters,
    defaults,
    setSearch,
    setProvider,
    setOrder,
    setCategory,
    reset,
  };
}

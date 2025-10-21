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

import type { CasinoFilters, CasinoSortOrder } from '../types';
import {
  DEFAULT_FILTERS,
  areFiltersEqual,
  deriveCategoryFromPath,
  normaliseCategory,
  sanitiseOrder,
} from './utils';
import { paths } from '@/routes/paths';
import { rememberCasinoOrder, rememberCasinoProvider } from '@/app/casino/(main)/actions';

type CasinoFiltersState = {
  filters: CasinoFilters;
  defaults: CasinoFilters;
  setFilters: (filters: CasinoFilters) => CasinoFilters;
  syncInitialFilters: (filters: CasinoFilters) => void;
  setSearch: (value: string) => CasinoFilters;
  setProvider: (value: string) => CasinoFilters;
  setOrder: (value: CasinoSortOrder) => CasinoFilters;
  setCategory: (value: string) => CasinoFilters;
  resetFilters: () => CasinoFilters;
};

type CasinoFiltersStore = StoreApi<CasinoFiltersState>;

function createCasinoFiltersStore(initialFilters: CasinoFilters) {
  const defaults = {
    ...DEFAULT_FILTERS,
    category: normaliseCategory(initialFilters.category ?? DEFAULT_FILTERS.category),
  };

  return createStore<CasinoFiltersState>()((set, get) => ({
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

const CasinoFiltersContext = createContext<CasinoFiltersStore | null>(null);

export function CasinoFiltersProvider({
  initialFilters,
  children,
}: {
  initialFilters: CasinoFilters;
  children: ReactNode;
}) {
  const storeRef = useRef<CasinoFiltersStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = createCasinoFiltersStore(initialFilters);
  }

  const store = storeRef.current;

  useEffect(() => {
    store?.getState().syncInitialFilters(initialFilters);
  }, [initialFilters, store]);

  return (
    <CasinoFiltersContext.Provider value={store!}>
      {children}
    </CasinoFiltersContext.Provider>
  );
}

export function useCasinoFiltersStore() {
  const store = useContext(CasinoFiltersContext);

  if (!store) {
    throw new Error('useCasinoFiltersStore must be used within CasinoFiltersProvider');
  }

  return store;
}

function deriveFiltersFromLocation(
  pathname: string,
  searchParams: ReadonlyURLSearchParams,
): CasinoFilters {
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

export function CasinoFiltersHydrator({ initialFilters }: { initialFilters: CasinoFilters }) {
  const store = useCasinoFiltersStore();
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

function buildUrlForFilters(filters: CasinoFilters) {
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
      ? `${paths.casinos.root}/${filters.category}`
      : paths.casinos.root;

  const query = params.toString();

  return query ? `${basePath}?${query}` : basePath;
}

function mergeFilters(current: CasinoFilters, patch: Partial<CasinoFilters>): CasinoFilters {
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

export function useCasinoFilters() {
  const store = useCasinoFiltersStore();
  const router = useRouter();
  const { filters, defaults } = useStore(store, (state) => ({
    filters: state.filters,
    defaults: state.defaults,
  }));

  const updateUrl = useCallback(
    (nextFilters: CasinoFilters) => {
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
        void rememberCasinoProvider(value);
      });
    },
    [store, updateUrl],
  );

  const setOrder = useCallback(
    (value: CasinoSortOrder) => {
      const previousFilters = store.getState().filters;
      const nextFilters = store.getState().setOrder(value);

      if (nextFilters === previousFilters) {
        return;
      }

      updateUrl(nextFilters);
      startTransition(() => {
        void rememberCasinoOrder(value);
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

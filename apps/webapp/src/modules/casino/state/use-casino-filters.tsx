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
  setFilters: (filters: CasinoFilters) => void;
};

type CasinoFiltersStore = StoreApi<CasinoFiltersState>;

function createCasinoFiltersStore(initialFilters: CasinoFilters) {
  return createStore<CasinoFiltersState>()((set, get) => ({
    filters: initialFilters,
    setFilters: (next) => {
      const current = get().filters;
      if (areFiltersEqual(current, next)) {
        return;
      }

      set({ filters: next });
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
    store?.getState().setFilters(initialFilters);
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
  const filters = useStore(store, (state) => state.filters);

  const updateFilters = useCallback(
    (patch: Partial<CasinoFilters>) => {
      const nextFilters = mergeFilters(filters, patch);
      store.getState().setFilters(nextFilters);

      const url = buildUrlForFilters(nextFilters);
      router.replace(url, { scroll: false });
    },
    [filters, router, store],
  );

  const setSearch = useCallback(
    (value: string) => {
      updateFilters({ search: value });
    },
    [updateFilters],
  );

  const setProvider = useCallback(
    (value: string) => {
      updateFilters({ provider: value });
      startTransition(() => {
        void rememberCasinoProvider(value);
      });
    },
    [updateFilters],
  );

  const setOrder = useCallback(
    (value: CasinoSortOrder) => {
      updateFilters({ order: value });
      startTransition(() => {
        void rememberCasinoOrder(value);
      });
    },
    [updateFilters],
  );

  const setCategory = useCallback(
    (value: string) => {
      updateFilters({ category: value });
    },
    [updateFilters],
  );

  const reset = useCallback(() => {
    updateFilters({ search: '', provider: '', order: DEFAULT_FILTERS.order });
  }, [updateFilters]);

  return {
    filters,
    setSearch,
    setProvider,
    setOrder,
    setCategory,
    reset,
  };
}

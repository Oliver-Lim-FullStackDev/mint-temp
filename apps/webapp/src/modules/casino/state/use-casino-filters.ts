'use client';

import { useCallback, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { paths } from '@/routes/paths';
import type { CasinoFilters, CasinoSortOrder } from '../types';

const DEFAULT_FILTERS: CasinoFilters = {
  category: 'all',
  search: '',
  order: 'ASC',
  provider: '',
};

function sanitiseOrder(value: string | null): CasinoSortOrder {
  if (value?.toUpperCase() === 'DESC') {
    return 'DESC';
  }

  return 'ASC';
}

function deriveCategory(pathname: string): string {
  const root = paths.casinos.root;
  if (!pathname.startsWith(root)) {
    return DEFAULT_FILTERS.category;
  }

  const segments = pathname
    .slice(root.length)
    .split('/')
    .map((segment) => segment.trim())
    .filter(Boolean);

  if (!segments.length) {
    return DEFAULT_FILTERS.category;
  }

  return segments[0]?.toLowerCase() ?? DEFAULT_FILTERS.category;
}

export function useCasinoFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const category = useMemo(() => deriveCategory(pathname), [pathname]);
  const search = searchParams.get('q') ?? DEFAULT_FILTERS.search;
  const provider = searchParams.get('provider') ?? DEFAULT_FILTERS.provider;
  const order = sanitiseOrder(searchParams.get('order'));

  const filters = useMemo<CasinoFilters>(
    () => ({ category, search, provider, order }),
    [category, order, provider, search],
  );

  const updateFilters = useCallback(
    (partial: Partial<CasinoFilters>) => {
      const nextFilters: CasinoFilters = {
        category: partial.category ?? filters.category,
        search: partial.search ?? filters.search,
        order: partial.order ?? filters.order,
        provider: partial.provider ?? filters.provider,
      };

      const params = new URLSearchParams();

      if (nextFilters.search.trim()) {
        params.set('q', nextFilters.search.trim());
      }

      if (nextFilters.order !== 'ASC') {
        params.set('order', nextFilters.order);
      }

      if (nextFilters.provider) {
        params.set('provider', nextFilters.provider);
      }

      const root = paths.casinos.root;
      const basePath =
        nextFilters.category && nextFilters.category !== 'all'
          ? `${root}/${nextFilters.category}`
          : root;

      const queryString = params.toString();
      const url = queryString ? `${basePath}?${queryString}` : basePath;

      router.replace(url, { scroll: false });
    },
    [filters, router],
  );

  const setSearch = useCallback((value: string) => updateFilters({ search: value }), [updateFilters]);
  const setOrder = useCallback((value: CasinoSortOrder) => updateFilters({ order: value }), [updateFilters]);
  const setProvider = useCallback((value: string) => updateFilters({ provider: value }), [updateFilters]);
  const setCategory = useCallback((value: string) => updateFilters({ category: value }), [updateFilters]);
  const reset = useCallback(() => updateFilters({ search: '', provider: '', order: 'ASC' }), [updateFilters]);

  return {
    filters,
    setSearch,
    setOrder,
    setProvider,
    setCategory,
    reset,
  };
}

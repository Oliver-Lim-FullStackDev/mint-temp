import { paths } from '@/routes/paths';
import type { CasinoFilters, CasinoSortOrder } from '../types';

export const DEFAULT_FILTERS: CasinoFilters = {
  category: 'all',
  search: '',
  order: 'ASC',
  provider: '',
};

export function sanitiseOrder(value: string | null | undefined): CasinoSortOrder {
  if (value && value.toUpperCase() === 'DESC') {
    return 'DESC';
  }

  return 'ASC';
}

export function normaliseCategory(category: string | null | undefined): string {
  const trimmed = category?.trim().toLowerCase();
  if (!trimmed || trimmed === 'all') {
    return DEFAULT_FILTERS.category;
  }

  return trimmed;
}

export function deriveCategoryFromPath(pathname: string): string {
  if (!pathname.startsWith(paths.casinos.root)) {
    return DEFAULT_FILTERS.category;
  }

  const segments = pathname
    .slice(paths.casinos.root.length)
    .split('/')
    .map((segment) => segment.trim())
    .filter(Boolean);

  if (!segments.length) {
    return DEFAULT_FILTERS.category;
  }

  if (segments[0] === 'game') {
    return DEFAULT_FILTERS.category;
  }

  return normaliseCategory(segments[0]);
}

export function areFiltersEqual(a: CasinoFilters, b: CasinoFilters): boolean {
  return (
    a.category === b.category &&
    a.search.trim() === b.search.trim() &&
    a.order === b.order &&
    a.provider === b.provider
  );
}

import { paths } from '@/routes/paths';
import type { GamesFilters, GamesSortOrder } from '../filters.types';

export type GamesCategoryDefinition = {
  slug: string;
  label: string;
  tags: string[];
};

export const GAMES_CATEGORY_DEFINITIONS: GamesCategoryDefinition[] = [
  { slug: 'all', label: 'Explore', tags: [] },
  { slug: 'originals', label: 'Mint Originals', tags: ['originals'] },
  { slug: 'slots', label: 'Slots', tags: ['slots'] },
  { slug: 'game-show', label: 'Live Casino', tags: ['game-show'] },
  { slug: 'table-games', label: 'Table Games', tags: ['table-games'] },
  { slug: 'new', label: 'New Arrivals', tags: ['new'] },
  { slug: 'blackjack', label: 'Blackjack', tags: ['blackjack'] },
  { slug: 'roulette', label: 'Roulette', tags: ['roulette'] },
  { slug: 'baccarat', label: 'Baccarat', tags: ['baccarat'] },
];

export const DEFAULT_FILTERS: GamesFilters = {
  category: 'all',
  search: '',
  order: 'ASC',
  provider: '',
};

export function sanitiseOrder(value: string | null | undefined): GamesSortOrder {
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

export function areFiltersEqual(a: GamesFilters, b: GamesFilters): boolean {
  return (
    a.category === b.category &&
    a.search.trim() === b.search.trim() &&
    a.order === b.order &&
    a.provider === b.provider
  );
}

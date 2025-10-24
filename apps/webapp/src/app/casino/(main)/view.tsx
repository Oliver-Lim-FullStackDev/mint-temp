'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Box, Container } from '@mint/ui/components/core';
import { Text, EmptyContent } from '@mint/ui/components';
import { BannerCarrousel, CarrouselItem } from '@mint/ui/components';
import { GamesList } from '@/modules/games/components/games-list';
import type { Game } from '@/modules/games/games.types';
import {
  GAMES_CATEGORY_DEFINITIONS,
  DEFAULT_FILTERS,
} from '@/modules/games/state';
import { paths } from '@/routes/paths';
import {
  buildGamesQuery,
  GamesCategoryNav,
  GamesFiltersBar,
  GamesFiltersHydrator,
  GamesFiltersProvider,
  type GamesApiResponse,
  type GamesFilters,
  type GamesQueryKey,
  useGamesFilters,
  fetchGames,
} from '@/modules/games';

let CAROUSEL_GAME_IDS = {
  octogame: '14098',
  pengwin: '14102',
  mintySpins: 'minty-spins',
};

if (process.env.NEXT_PUBLIC_MINT_ENV === 'production') {
  CAROUSEL_GAME_IDS = {
    octogame: '2',
    pengwin: '6',
    mintySpins: 'minty-spins',
  };
}

const COMING_SOON_GAMES: Game[] = [
  {
    displayProvider: 'Mint',
    id: 'milked',
    title: 'Milked',
    imageUrl: '/assets/games/comin-soon/milked.jpg',
    titleUrl: '',
    provider: 'coming-soon',
    slug: 'milked',
  },
  {
    displayProvider: 'Mint',
    id: 'deep-sea',
    title: 'Deep sea munchies',
    imageUrl: '/assets/games/comin-soon/deep-sea-munchies.jpg',
    titleUrl: '',
    provider: 'coming-soon',
    slug: 'deep-sea',
  },
  {
    displayProvider: 'Mint',
    id: 'fortune-teller',
    title: 'Fortune Teller',
    imageUrl: '/assets/games/comin-soon/fortune-teller.jpg',
    titleUrl: '',
    provider: 'coming-soon',
    slug: 'fortune-teller',
  },
  {
    displayProvider: 'Mint',
    id: 'soccer-crash',
    title: 'Soccer Crash',
    imageUrl: '/assets/games/comin-soon/coming-soon-thumbnail.png',
    titleUrl: '',
    provider: 'coming-soon',
    slug: 'soccer-crash',
  },
];

interface CasinoViewProps {
  initialFilters: GamesFilters;
  hasError?: boolean;
  pendingUrlSync?: {
    provider: boolean;
    order: boolean;
  };
}

export function CasinoView({
  initialFilters,
  hasError = false,
  pendingUrlSync,
}: CasinoViewProps) {
  const shouldSyncUrl = Boolean(
    pendingUrlSync?.provider || pendingUrlSync?.order
  );

  return (
    <GamesFiltersProvider initialFilters={initialFilters}>
      <GamesFiltersHydrator initialFilters={initialFilters} />
      {shouldSyncUrl && pendingUrlSync ? (
        <GamesUrlSyncer pendingUrlSync={pendingUrlSync} />
      ) : null}
      <GamesContent hasError={hasError} />
    </GamesFiltersProvider>
  );
}

function GamesUrlSyncer({
  pendingUrlSync,
}: {
  pendingUrlSync: { provider: boolean; order: boolean };
}) {
  const hasSyncedRef = useRef(false);
  const { filters, setProvider, setOrder } = useGamesFilters();

  useEffect(() => {
    if (hasSyncedRef.current) {
      return;
    }

    hasSyncedRef.current = true;

    if (pendingUrlSync.provider && filters.provider) {
      setProvider(filters.provider);
    }

    if (pendingUrlSync.order && filters.order !== DEFAULT_FILTERS.order) {
      setOrder(filters.order);
    }
  }, [
    filters.order,
    filters.provider,
    pendingUrlSync.order,
    pendingUrlSync.provider,
    setOrder,
    setProvider,
  ]);

  return null;
}

function GamesContent({ hasError }: { hasError?: boolean }) {
  const { filters, setCategory, setOrder, setProvider, setSearch } =
    useGamesFilters();

  const queryParams = useMemo(() => buildGamesQuery(filters), [filters]);
  const queryKey = useMemo<GamesQueryKey>(
    () => ['games', queryParams],
    [queryParams]
  );

  const { data, isFetching, isError } = useQuery<GamesApiResponse>({
    queryKey,
    queryFn: () => fetchGames(queryParams),
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const availableGames = data?.games ?? [];

  const providers = data?.meta.providers ?? [];
  const fallbackCategories = useMemo(() => {
    const tagSets = availableGames.map((game) => {
      const combined = [
        ...(game.tags ?? []),
        ...(game.categories?.map((category) => category.slug) ?? []),
      ];

      return new Set(
        combined
          .map((tag) => tag?.toString().trim().toLowerCase())
          .filter((tag): tag is string => Boolean(tag))
      );
    });

    return GAMES_CATEGORY_DEFINITIONS.map((definition) => {
      if (!definition.tags.length) {
        return {
          slug: definition.slug,
          label: definition.label,
          count: availableGames.length,
        };
      }

      const normalisedTags = definition.tags.map((tag) =>
        tag.trim().toLowerCase()
      );

      const count = tagSets.reduce((total, tags) => {
        return total + (normalisedTags.some((tag) => tags.has(tag)) ? 1 : 0);
      }, 0);

      return {
        slug: definition.slug,
        label: definition.label,
        count,
      };
    });
  }, [availableGames]);

  const categories = data?.meta.categories ?? fallbackCategories;

  const sortedGames = useMemo(() => {
    const combined = [...availableGames];

    COMING_SOON_GAMES.forEach((game) => {
      const alreadyPresent = combined.some(
        (existing) => existing.id === game.id
      );

      if (!alreadyPresent) {
        combined.push(game);
      }
    });

    return combined;
  }, [availableGames]);

  const showErrorState = ((hasError && !data) || isError) && !isFetching;
  const showEmptyState = !showErrorState && !isFetching && !sortedGames.length;

  const carrouselItems: CarrouselItem[] = [
    {
      id: '1',
      bgCover: '/assets/games/carrousels/octogame.png',
      title: 'OCTOGAME',
      subtitle: 'Do you dare to play?',
      gameLink: {
        label: 'Play OCTOGAME',
        url: paths.casino.details(CAROUSEL_GAME_IDS.octogame),
      },
    },
    {
      id: '2',
      bgCover: '/assets/games/carrousels/pengwin.png',
      title: 'PENGWIN',
      subtitle: "Don't get rekt!",
      gameLink: {
        label: 'Play PENGWIN',
        url: paths.casino.details(CAROUSEL_GAME_IDS.pengwin),
      },
    },
    {
      id: '3',
      bgCover: '/assets/games/carrousels/mintySpins.png',
      title: 'MINTY SPINS',
      subtitle: 'Win MBX, XP and Raffle tickets daily',
      gameLink: {
        label: 'Play MINTY SPINS',
        url: paths.casino.details(CAROUSEL_GAME_IDS.mintySpins),
      },
    },
  ];

  return (
    <Container>
      <BannerCarrousel
        carrouselItems={carrouselItems}
        height="250px"
        autoPlay
        autoPlayInterval={5000}
      />

      <Box
        sx={{
          width: '100%',
          borderRadius: 2,
          background:
            'linear-gradient(90deg, rgba(0, 0, 0, 0.58) 0%, rgba(0, 0, 0, 0.64) 100%)',
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
        }}
      >
        <GamesCategoryNav
          categories={categories}
          activeCategory={filters.category}
          onSelect={setCategory}
        />

        <GamesFiltersBar
          search={filters.search}
          provider={filters.provider}
          order={filters.order}
          providers={providers}
          onSearchChange={setSearch}
          onProviderChange={setProvider}
          onOrderChange={setOrder}
        />
      </Box>

      <Box sx={{ py: 1.5 }}>
        {showErrorState ? (
          <EmptyContent filled title="Unable to load games" sx={{ py: 10 }} />
        ) : showEmptyState ? (
          <EmptyContent filled title="No games found" sx={{ py: 10 }} />
        ) : (
          <GamesList games={sortedGames} loading={isFetching} />
        )}
      </Box>
    </Container>
  );
}

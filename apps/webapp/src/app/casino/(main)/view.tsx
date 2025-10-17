'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Box, Container } from '@mint/ui/components/core';
import { Text, EmptyContent } from '@mint/ui/components';
import BannerCarrousel, { CarrouselItem } from '@/components/banner-carrousel';
import { GamesList } from '@/modules/games/components/games-list';
import type { Game } from '@/modules/games/games.types';
import { paths } from '@/routes/paths';
import {
  buildCasinoQuery,
  CasinoCategoryNav,
  CasinoFiltersBar,
  type CasinoApiResponse,
  useCasinoFilters,
  fetchCasinoGames,
} from '@/modules/casino';

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
  initialData: CasinoApiResponse | null;
  hasError?: boolean;
}

export function CasinoView({ initialData, hasError = false }: CasinoViewProps) {
  const { filters, setCategory, setOrder, setProvider, setSearch } = useCasinoFilters();

  const queryParams = useMemo(() => buildCasinoQuery(filters), [filters]);

  const { data, isFetching, isError } = useQuery({
    queryKey: ['casino-games', queryParams],
    queryFn: () => fetchCasinoGames(queryParams),
    initialData: initialData ?? undefined,
    staleTime: 30_000,
    keepPreviousData: true,
  });

  const apiData = data ?? initialData ?? undefined;
  const availableGames = apiData?.games ?? [];
  const providers = apiData?.meta.providers ?? [];
  const categories = apiData?.meta.categories ?? [
    { slug: 'all', label: 'All Games', count: availableGames.length },
  ];

  const sortedGames = useMemo(() => {
    const combined = [...availableGames, ...COMING_SOON_GAMES];
    return combined.sort(
      (a, b) => (b.provider === 'mint' ? 1 : 0) - (a.provider === 'mint' ? 1 : 0),
    );
  }, [availableGames]);

  const showErrorState = hasError || isError;
  const showEmptyState = !showErrorState && !isFetching && !sortedGames.length;

  const carrouselItems: CarrouselItem[] = [
    {
      id: '1',
      bgCover: '/assets/games/carrousels/octogame.png',
      title: 'OCTOGAME',
      subtitle: 'Do you dare to play?',
      gameLink: paths.casinos.details(CAROUSEL_GAME_IDS.octogame),
    },
    {
      id: '2',
      bgCover: '/assets/games/carrousels/pengwin.png',
      title: 'PENGWIN',
      subtitle: "Don't get rekt!",
      gameLink: paths.casinos.details(CAROUSEL_GAME_IDS.pengwin),
    },
    {
      id: '3',
      bgCover: '/assets/games/carrousels/mintySpins.png',
      title: 'MINTY SPINS',
      subtitle: 'Win MBX, XP and Raffle tickets daily',
      gameLink: paths.casinos.details(CAROUSEL_GAME_IDS.mintySpins),
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

      <Box mt={2}>
        <Text variant="h5" centered>
          Play games and chase the bags!
        </Text>
      </Box>

      <Box sx={{ py: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <CasinoCategoryNav
          categories={categories}
          activeCategory={filters.category}
          onSelect={setCategory}
        />

        <CasinoFiltersBar
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

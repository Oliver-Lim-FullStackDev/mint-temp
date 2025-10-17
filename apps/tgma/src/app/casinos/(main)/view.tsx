'use client';

import React, { useMemo } from 'react';
import { Box, Container } from '@mint/ui/components/core';
import { EmptyContent } from '@mint/ui/components/empty-content';
import BannerCarrousel, { CarrouselItem } from '@/components/banner-carrousel';
import { Text } from '@mint/ui/components';
import { RankingShareButton } from '@/modules/account/components/ranking-share-button';
import { GamesList } from '@/modules/games/components/games-list';
import { GamesMenu } from '@/modules/games/components/games-menu';
import type { Game } from '@/modules/games/games.types';
import { paths } from '@/routes/paths';

let CAROUSEL_GAME_IDS = {
  octogame: '14098',
  pengwin: '14102',
  mintySpins: 'minty-spins',
};
// static for now for Prod
if (process.env.NEXT_PUBLIC_MINT_ENV === "production") {
  CAROUSEL_GAME_IDS = {
    octogame: '2',
    pengwin: '6',
    mintySpins: 'minty-spins',
  }
}

interface CasinoViewProps {
  games: Game[];
  hasError?: boolean;
}

export function CasinoView({ games, hasError = false }: CasinoViewProps) {
  const commingSoonGames = [
    {
      displayProvider: 'Mint',
      id: 'milked',
      title: 'Milked',
      imageUrl: '/assets/games/comin-soon/milked.jpg',
      titleUrl: '',
      provider: 'coming-soon',
      slug: ""
    },
    {
      displayProvider: 'Mint',
      id: 'deep-sea',
      title: 'Deep sea munchies',
      imageUrl: '/assets/games/comin-soon/deep-sea-munchies.jpg',
      titleUrl: '',
      provider: 'coming-soon',
      slug: ""
    },
    {
      displayProvider: 'Mint',
      id: 'fortune-teller',
      title: 'Fortune Teller',
      imageUrl: '/assets/games/comin-soon/fortune-teller.jpg',
      titleUrl: '',
      provider: 'coming-soon',
      slug: ""
    },
    {
      displayProvider: 'Mint',
      id: 'soccer-crash',
      title: 'Soccer Crash',
      imageUrl: '/assets/games/comin-soon/coming-soon-thumbnail.png',
      titleUrl: '',
      provider: 'coming-soon',
      slug: ""
    }
  ]

  const sortedGames = useMemo(() => {
    const activeGames = [...games].sort((a, b) => {
      const orderA = typeof a.sort_order === 'number' ? a.sort_order : Number.MAX_SAFE_INTEGER;
      const orderB = typeof b.sort_order === 'number' ? b.sort_order : Number.MAX_SAFE_INTEGER;

      if (orderA !== orderB) {
        return orderA - orderB;
      }

      const titleA = a.title ?? a.slug ?? '';
      const titleB = b.title ?? b.slug ?? '';

      return titleA.localeCompare(titleB, undefined, { sensitivity: 'base' });
    });

    return [...activeGames, ...commingSoonGames];
  }, [games]);

  const showEmptyState = hasError || !sortedGames.length;

  const sampleCarrouselItems: CarrouselItem[] = [
    {
      id: '1',
      bgCover: '/assets/games/carrousels/octogame.png',
      title: 'OCTOGAME',
      subtitle: 'Do you dare to play?',
      gameLink: paths.casinos.details(CAROUSEL_GAME_IDS.octogame)
    },
    {
      id: '2',
      bgCover: '/assets/games/carrousels/pengwin.png',
      title: 'PENGWIN',
      subtitle: "Don't get rekt!",
      gameLink: paths.casinos.details(CAROUSEL_GAME_IDS.pengwin)
    },
    {
      id: '3',
      bgCover: '/assets/games/carrousels/mintySpins.png',
      title: 'MINTY SPINS',
      subtitle: 'Win MBX, XP and Raffle tickets daily',
      gameLink: paths.casinos.details(CAROUSEL_GAME_IDS.mintySpins)
    }
  ];

  return (
    <Container>
      <GamesMenu />

      <BannerCarrousel
          carrouselItems={sampleCarrouselItems}
          height="250px"
          autoPlay={true}
          autoPlayInterval={5000}
      />

      <Box mt={2}>
        <Text variant="h5" centered>Play games and chase the bags!</Text>
      </Box>

      <Box sx={{ py: 1.5 }}>
        {showEmptyState ? (
          <EmptyContent filled title="No games found" sx={{ py: 10 }} />
        ) : (
          <GamesList games={sortedGames} />
        )}
      </Box>
      <Box sx={{ my: 2 }}>
        <RankingShareButton />
      </Box>
    </Container>
  );
}

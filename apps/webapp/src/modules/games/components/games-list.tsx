import { paths } from '@/routes/paths';
import { Box, Grid } from '@mint/ui/components/core';
import { ListItemSkeleton } from '@/components/list/list-skeleton';
import type { Game } from '../games.types';
import { GamesListItem } from './games-list-item';

type GamesListProps = {
  games: Game[];
  loading?: boolean;
};

export function GamesList({ games, loading }: GamesListProps) {
  const gridStyles = {
    gap: 1.25,
    display: 'grid',
    gridTemplateColumns: {
      xs: 'repeat(2, minmax(0, 1fr))',
      sm: 'repeat(3, minmax(0, 1fr))',
      md: 'repeat(4, minmax(0, 1fr))',
      lg: 'repeat(8, minmax(0, 1fr))',
      xl: 'repeat(8, minmax(0, 1fr))',
    },
  } as const;

  const renderLoading = () => (
    <Box sx={gridStyles}>
      <ListItemSkeleton
        itemCount={16}
        sx={{
          width: '100%',
          borderRadius: 1,
          aspectRatio: '658 / 1000',
        }}
      />
    </Box>
  );

  const renderList = () => (
    <Box sx={gridStyles}>
      {games.map((game) => (
        <Box key={game.id} sx={{ minWidth: 0 }}>
        <GamesListItem
          game={game}
          detailsHref={paths.casinos.details(game.id)}
          sx={{ height: '100%' }}
        />
      </Box>
      ))}
    </Box>
  );

  return (
    <>
      {loading ? renderLoading() : renderList()}
    </>
  );
}

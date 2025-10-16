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
  const renderLoading = () => (
    <Box
      sx={{
        gap: 1.25,
        display: 'grid',
        gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
      }}
    >
      <ListItemSkeleton />
    </Box>
  );

  const renderList = () => (
    <Grid container spacing={1.25}>
      {games.map((game) => (
        <Grid
          key={game.id}
          size={{
            xs: 4,
          }}
        >
          <GamesListItem game={game} detailsHref={paths.casinos.details(game.id)} />
        </Grid>
      ))}
    </Grid>
  );

  return (
    <>
      {loading ? renderLoading() : renderList()}
    </>
  );
}

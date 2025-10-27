'use client';

import type { Game } from '@mint/types';
import { Container } from '@mint/ui/components/core';
import { EmptyContent } from '@mint/ui/components';
import { GameLauncher } from 'src/modules/games/components/game-launcher';

interface GameViewProps {
  game: Game;
  initial: null;
}

export function GameView({
  game,
  initial,
}: GameViewProps) {
  // While the server component always provides these (or redirects), we still guard in the client
  if (!game) {
    return (
      <Container sx={{ py: 10 }}>
        <EmptyContent title="Game not found" />
      </Container>
    );
  }

  return (
    <Container sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <GameLauncher game={game} mode="classic" />
    </Container>
  );
}

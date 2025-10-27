'use client';

import React from 'react';
import { Container } from '@mint/ui/components/core';
import { EmptyContent } from '@mint/ui/components/empty-content';
import { GameLauncher } from 'src/modules/games/components/game-launcher';
import { MintGameLauncher } from 'src/modules/games/components/mint-game-launcher';
import type { SlotGameInitDto } from 'src/modules/games/components/mint-slots/mint-game-slots.dto';
import type { Game } from '@mint/types';

interface GameViewProps {
  game: Game;
  initial: SlotGameInitDto;
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
      {game.provider === 'mint' ? (
        // We know slotConfig & initial are non-null for mint
        <MintGameLauncher
          gameId={game.id}
          initial={initial}
        />
      ) : (
        <GameLauncher game={game} mode="classic" />
      )}
    </Container>
  );
}

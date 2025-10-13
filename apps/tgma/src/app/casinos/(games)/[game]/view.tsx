'use client';

import { Container } from '@mint/ui/components';
import { GameLauncher } from '@/modules/games/components/game-launcher';
import { MintGameLauncher } from '@/modules/games/components/mint-game-launcher';
import type { SlotGameInitDto } from '@/modules/games/components/mint-slots/mint-game-slots.dto';
import type { Game } from '@/modules/games/games.types';
import { EmptyContent } from '@mint/ui/components/empty-content';

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

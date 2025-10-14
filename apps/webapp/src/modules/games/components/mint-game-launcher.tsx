'use client';

import { Suspense } from 'react';
import { Box, CircularProgress } from '@mint/ui/components';
import { SlotGameInitDto } from './mint-slots/mint-game-slots.dto';
import { MintGameSlots } from "./mint-slots/mint-game-slots.client";

type MintGameLauncherProps = {
  gameId: string;
  initial: SlotGameInitDto;
};

export function MintGameLauncher({ gameId, initial }: MintGameLauncherProps) {
  return (
    <Box>
      <Suspense
        fallback={
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        }
      >
        <MintGameSlots gameId={gameId} initial={initial} />
      </Suspense>
      {/* Future: {gameConfig.type === 'crash' && <MintCrashGame gameId={gameId} /> */}
    </Box>
  );
}

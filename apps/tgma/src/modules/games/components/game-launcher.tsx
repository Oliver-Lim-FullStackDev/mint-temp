'use client';

import type { Game } from '@mint/types';

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getServerSession } from '@mint/client';
import { Box } from '@mint/ui/components/core';
import { GameLauncherHeroGaming } from '@mint/ui/modules/games/game-launcher-herogaming';
import { useSession, useSetSession } from '@/modules/account/session-store';
import { useTelegramBackButton } from '@/hooks/useTelegramBackButton';
import { paths } from '@/routes/paths';

export function GameLauncher({ game, mode }: { game: Game; mode: string }) {
  const { session } = useSession();
  const token = session?.token || null;
  const setSession = useSetSession();
  const frameRef = useRef<any>(null);
  const router = useRouter();

  const goBack = () => router.push(paths.casinos.root);
  useTelegramBackButton(true, goBack);

  useEffect(() => {
    if (!frameRef.current.gameUrl) {
      return;
    }

    // update session onLeave
    return () => {
      (async () => {
        const session = await getServerSession();
        if (session) {
          setSession(session);
        }
      })();
    }

  }, [frameRef.current]);


  return (
    <Box display="flex" flexDirection="column" flex={1} minHeight={0} sx={{ bgcolor: '#000', mx: -2 }}>
      <Box sx={{ position: 'relative', flex: 1, display: 'flex', marginBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        <GameLauncherHeroGaming
          game={game}
          mode={mode}
          token={token}
        />
        {/* transparent scroll layer */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            // height: 40, // just a top strip
            zIndex: 2,
            background: 'transparent',
            touchAction: 'pan-y',
          }}
        />
      </Box>
    </Box>
  );
}

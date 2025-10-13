'use client';

import type { Game } from '../games.types';

import { useEffect, useMemo, useRef } from 'react';
import IframeResizer from '@iframe-resizer/react';
import { useRouter } from "next/navigation";
import { getServerSession } from '@mint/client';
import { Box } from '@mint/ui/components/core';
import { paths } from '@/routes/paths';
import { useSession, useSetSession } from '@/modules/account/session-store';
import { useTelegramBackButton } from '@/hooks/useTelegramBackButton';

function buildGameUrl(args: {
  gameId: string; serverUrl: string; brand: string; clientType: string;
  cdnPrefix: string; freeGames: string | null; language: string; mode: string; token: string;
}) {
  const { gameId, serverUrl, brand, clientType, cdnPrefix, freeGames, language, mode, token } = args;
  const url = new URL(`/games/${gameId}`, serverUrl);
  url.searchParams.set('brand', brand);
  url.searchParams.set('client_type', clientType);
  url.searchParams.set('env', cdnPrefix);
  url.searchParams.set('free_games', freeGames || '');
  url.searchParams.set('language', language);
  url.searchParams.set('mode', mode);
  url.searchParams.set('token', token || '');
  return url.toString();
}

export function GameLauncher({ game, mode }: { game: Game; mode: string }) {
  const { session } = useSession();
  const token = session?.token || null;
  const setSession = useSetSession();
  const frameRef = useRef<any>(null);
  const router = useRouter();

  const gameUrl = useMemo(() => {
    if (!game?.id || !token) return;
    return buildGameUrl({
      gameId: game.id,
      serverUrl: process.env.NEXT_PUBLIC_HEROGAMING_GAME_SERVER_URL!,
      brand: process.env.NEXT_PUBLIC_HEROGAMING_BRAND!,
      clientType: process.env.NEXT_PUBLIC_HEROGAMING_GAME_DEFAULT_CLIENT! || 'browser',
      cdnPrefix: 'stg',
      freeGames: '',
      language: 'en',
      mode,
      token,
      // TODO HideExitButton: true
      // Currently hardcoded by Yolted in their games so Home button is hidden for us
    });
  }, [game?.id, token, mode]);

  const goBack = () => router.push(paths.casinos.root);
  useTelegramBackButton(true, goBack);

  useEffect(() => {
    if (!gameUrl) {
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

  }, []);

  if (!gameUrl) return null;

  const HEADER_H = 56;
  const SIDE_W = 48;
  const gameOrigin = new URL(process.env.NEXT_PUBLIC_HEROGAMING_GAME_SERVER_URL!).origin;

  return (
    <Box display="flex" flexDirection="column" flex={1} minHeight={0} sx={{ bgcolor: '#000', mx: -2 }}>
      <Box sx={{ position: 'relative', flex: 1, display: 'flex', marginBottom: 'var(--tg-safe-area-inset-bottom)' }}>
        <IframeResizer
          src={gameUrl}
          sandbox="allow-scripts allow-same-origin allow-modals allow-popups allow-presentation allow-forms"
          style={{ width: '100%', border: 0, minHeight: '100%', maxHeight: '100%' }}

          // iframe-resizer options
          direction="vertical"
          log={process.env.NODE_ENV !== 'production'}
          // checkOrigin={[gameOrigin]}
          checkOrigin={false}
          license="GPLv3"
          scrolling={false}

          // events
          forwardRef={frameRef}
          onReady={() => {
            // First handshake: ask for size once we're ready
            frameRef.current?.resize?.();
            // Ping again shortly after, to catch loader→game swap
            requestAnimationFrame(() => frameRef.current?.resize?.());
            setTimeout(() => frameRef.current?.resize?.(), 200);
          }}

          onResized={(data) => console.info('Resized data', data)}
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

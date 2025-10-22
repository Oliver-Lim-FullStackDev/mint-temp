'use client';

import type { Game } from '@mint/types';

import React, { useRef, useMemo } from 'react';
import IframeResizer, { type IframeResizerProps } from '@iframe-resizer/react';

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

export interface GameLauncherHerogamingProps {
  game: Game;
  mode?: string;
  token: string;
  iFrameResizerProps?: IframeResizerProps
}

export function GameLauncherHeroGaming({
  game,
  mode = 'mobile',
  token,
  iFrameResizerProps
}: GameLauncherHerogamingProps) {
  const frameRef = useRef<any>(null);

  const gameUrl = useMemo(() => {
    if (!game?.id || !token) return '';

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
    }) || null;
  }, [game, mode, token, iFrameResizerProps]);

  if (!gameUrl) return null;


  return (
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

      {...iFrameResizerProps}
    />
  );
}

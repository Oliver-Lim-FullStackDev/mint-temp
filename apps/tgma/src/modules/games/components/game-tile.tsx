'use client';

import React, { useMemo } from 'react';
import { Box, CircularProgress, Typography } from '@mint/ui/components/core';
import { useGame } from '@/modules/games/hooks/use-game';
import type { Game } from '@mint/types';
import { Amount } from '@/components/amount';
import { Translation } from '@/components/translation';

interface CasinoGameTileProps extends Game {
  size: 'small' | 'medium' | 'large';
  disabled?: boolean;
  hideJackpot?: boolean;
}

export function CasinoGameTile({
  id,
  size,
  title,
  backgroundUrl,
  backgroundOverlayUrl,
  backgroundOverlayImageAlignment,
  titleUrl,
  provider,
  jackpotValue,
  jackpotCurrency,
  disabled,
  hideJackpot,
}: CasinoGameTileProps) {
  const { data: game, isLoading } = useGame(id);

  const resolved = useMemo(
    () => ({
      size,
      title: title ?? game?.title ?? '',
      backgroundUrl: backgroundUrl ?? game?.backgroundUrl,
      backgroundOverlayUrl: backgroundOverlayUrl ?? game?.backgroundOverlayUrl,
      backgroundOverlayImageAlignment:
        backgroundOverlayImageAlignment ?? game?.backgroundOverlayImageAlignment,
      titleUrl: titleUrl ?? game?.titleUrl,
      provider: provider ?? game?.displayProvider ?? game?.provider,
      jackpotValue: jackpotValue ?? game?.jackpotValue ?? 0,
      jackpotCurrency: jackpotCurrency ?? game?.jackpotCurrency,
      disabled,
    }),
    [game, size, title, backgroundUrl, backgroundOverlayUrl, backgroundOverlayImageAlignment, titleUrl, provider, jackpotValue, jackpotCurrency, disabled]
  );

  if (isLoading || !game) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height={180}
        width="100%"
      >
        <CircularProgress size={32} thickness={4} />
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative' }}>
      <Background
        backgroundUrl={resolved.backgroundUrl}
        backgroundOverlayUrl={resolved.backgroundOverlayUrl}
        backgroundOverlayImageAlignment={resolved.backgroundOverlayImageAlignment}
        disabled={resolved.disabled}
        size={resolved.size}
      >
        <Box display="flex" flexDirection="column" alignItems="center" height="100%">
          <ProviderLogo provider={resolved.provider} />
          {resolved.titleUrl ? (
            <TitleImage titleUrl={resolved.titleUrl} alt={resolved.title} />
          ) : (
            <Title size={resolved.size}>{resolved.title}</Title>
          )}
        </Box>

        {!hideJackpot && resolved.jackpotValue > 0 && (
          <Jackpot>
            <Box
              pb={1}
              fontSize="12px"
              color="text"
              display="flex"
              flexDirection="column"
              width="100%"
              alignItems="center"
              justifyContent="flex-end"
              height="150px"
              sx={{
                background: 'linear-gradient(180deg, rgba(8, 18, 20, 0) 0%, #081214 99.99%)',
              }}
            >
              <Amount currency={resolved.jackpotCurrency} amount={resolved.jackpotValue} />
              <Box color="text" pt={0}>
                <Translation i18nKey="game-tile.jackpot-value" variant="caption" color="text.secondary" />
              </Box>
            </Box>
          </Jackpot>
        )}
      </Background>
    </Box>
  );
}

function Title({ size, children }: { size: CasinoGameTileProps['size']; children: string }) {
  return (
    <Typography
      fontSize={size === 'large' ? '1.125rem' : '1rem'}
      fontWeight={500}
      textTransform="capitalize"
      textAlign="center"
      mt="auto"
      mb="auto"
    >
      {children}
    </Typography>
  );
}

function TitleImage({ titleUrl, alt }: { titleUrl: string; alt?: string }) {
  return (
    <Box mt="auto" pb={1} width="100%" display="flex" justifyContent="center">
      <img
        src={titleUrl}
        alt={alt}
        style={{
          display: 'block',
          width: '100%',
          height: 'auto',
          objectFit: 'contain',
        }}
      />
    </Box>
  );
}

function ProviderLogo({ provider }: { provider?: string }) {
  if (!provider) return null;
  return (
    <Box maxWidth="80%" position="absolute" zIndex={1} textAlign="center">
      <Typography variant="caption" color="text.secondary">
        {provider}
      </Typography>
    </Box>
  );
}

function Background({
  children,
  backgroundUrl,
  backgroundOverlayUrl,
  backgroundOverlayImageAlignment,
  size,
  disabled,
}: {
  children: React.ReactNode;
  backgroundUrl?: string;
  backgroundOverlayUrl?: string;
  backgroundOverlayImageAlignment?: string;
  size: CasinoGameTileProps['size'];
  disabled?: boolean;
}) {
  const bgStyle = {
    backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : undefined,
    backgroundSize: 'cover',
    backgroundPosition: backgroundOverlayImageAlignment === 'bottom' ? 'bottom center' : 'center',
    opacity: disabled ? 0.5 : 1,
    borderRadius: 8,
    height: size === 'large' ? 280 : size === 'medium' ? 220 : 180,
    position: 'relative' as const,
    overflow: 'hidden',
  };

  return <Box sx={bgStyle}>{children}</Box>;
}

function Jackpot({ children }: { children: React.ReactNode }) {
  return (
    <Box
      fontSize={[0, 3]}
      textAlign="center"
      justifyContent="center"
      position="absolute"
      display="flex"
      left={0}
      right={0}
      bottom={0}
    >
      {children}
    </Box>
  );
}

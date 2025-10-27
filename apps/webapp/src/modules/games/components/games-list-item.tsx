import { Text } from '@mint/ui/components';
import { Box, Card, CardProps, Link } from '@mint/ui/components/core';
import { useTheme } from '@mint/ui/components/core/styles';
import { RouterLink } from '@mint/mui/routes/components';
import BadgeBox from 'src/components/button/badge-box';
import type { Game } from "../games.types";

type GamesListItemProps = CardProps & {
  game: Game;
  detailsHref: string;
};

function GameContent({ game }: { game: Game }) {
  return (
    <>
      <Box
        component="img"
        src={game.imageUrl}
        alt={game.title}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          borderRadius: 1,
          backdropFilter: 'blur(2px)',
          mask: 'linear-gradient(rgba(0,0,0,0) 60%, rgba(0,0,0) 85%)',
          background: 'var(--components-backdrop, rgba(18, 28, 38, 0.48))',
          zIndex: 1,
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          p: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 1,
          background: `
            linear-gradient(
              180deg,
              color(display-p3 0 0 0 / 0.00) 40.42%,
              color(display-p3 0 0 0) 100%
            )
          `,
        }}
      >
        <img src="/logo/logo-full.svg" alt="MINT" width="29.47%" />
        {game?.provider === 'coming-soon' && (
          <BadgeBox
            isSmall
            borderRadius="999px"
            bold
            textVariant='body4'
            sx={{ position: 'absolute', bottom: '35px' }}
            badgeText={'Coming Soon'}
            color="#000000"
            bgColor="#00FCF7"
          />
        )}
        <Box>
          <Text variant="body4" sx={{ fontWeight: '700' }}>{game.title}</Text>
        </Box>
      </Box>
    </>
  );
}

export function GamesListItem({ game, detailsHref, sx, ...other }: GamesListItemProps) {
  const theme = useTheme();

  const isComingSoon = game?.provider === 'coming-soon';

  const commonSx = {
    textAlign: 'center',
    width: '100%',
    height: '100%',
    display: 'inline-block',
  };

  return (
    <Card sx={{
      ...sx, position: 'relative',
      border: '0.5px solid color(display-p3 1 1 1 / 0.10)',
      borderRadius: 1,
      boxShadow: theme.shadows[16],

      aspectRatio: '658 / 1000',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }} {...other}
    >
      {isComingSoon ? (
        <Box sx={{ ...commonSx, opacity: '40%' }}>
          <GameContent game={game} />
        </Box>
      ) : (
        <Link
          component={RouterLink}
          href={detailsHref}
          color="inherit"
          sx={commonSx}
        >
          <GameContent game={game} />
        </Link>
      )}
    </Card>
  );
}

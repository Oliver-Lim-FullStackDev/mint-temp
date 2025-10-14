import { m, keyframes, Box, Button, Avatar, Typography, Chip, varAlpha, Theme } from '@mint/ui';
import type { BoxProps } from '@mint/ui';

import { paths } from '@mint/ui/routes/paths';
import { CONFIG } from '@mint/ui/global-config';
import { Label } from '@mint/ui/components/label';
import { useMockedUser } from '@mint/ui/auth/hooks';
import { Iconify } from "@mint/ui/components/iconify";

// ----------------------------------------------------------------------

export function NavUpgrade({ sx, ...other }: BoxProps) {
  const { user } = useMockedUser();

  return (
    <Box
      sx={[{ px: 2, py: 5, textAlign: 'center' }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <Box sx={{ position: 'relative' }}>
          <Avatar src={user?.photoURL} alt={user?.displayName} sx={{ width: 48, height: 48 }}>
            {user?.displayName?.charAt(0).toUpperCase()}
          </Avatar>

          <Label
            color="success"
            variant="filled"
            sx={{
              top: -6,
              px: 0.5,
              left: 40,
              height: 20,
              position: 'absolute',
              borderBottomLeftRadius: 2,
            }}
          >
            Free
          </Label>
        </Box>

        <Box sx={{ mb: 2, mt: 1.5, width: 1 }}>
          <Typography
            variant="subtitle2"
            noWrap
            sx={{ mb: 1, color: 'var(--layout-nav-text-primary-color)' }}
          >
            {user?.displayName}
          </Typography>

          <Typography
            variant="body2"
            noWrap
            sx={{ color: 'var(--layout-nav-text-disabled-color)' }}
          >
            {user?.email}
          </Typography>
        </Box>

        <Button variant="contained" href={paths.minimalStore} target="_blank" rel="noopener">
          Upgrade to Pro
        </Button>
      </Box>
    </Box>
  );
}

// ----------------------------------------------------------------------

const bgShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;


export function UpgradeBlock({ sx, ...other }: BoxProps) {
  return (
    <Box
      sx={[
        (theme) => ({
          px: 3,
          py: 4,
          borderRadius: 2,
          position: 'relative',
          backgroundImage: `
            linear-gradient(
              135deg,
              ${varAlpha(theme.vars.palette.primary.mainChannel, 1)},
              rgba(210, 255, 28, 1)
            )`,
          backgroundSize: '200% 200%',
          backgroundBlendMode: 'overlay',
          animation: `${bgShift} 5s linear infinite`,
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box
        sx={(theme: Theme) => ({
          top: 0,
          left: 0,
          width: 1,
          height: 1,
          borderRadius: 2,
          position: 'absolute',
          border: `solid 3px ${varAlpha(theme.vars.palette.common.whiteChannel, 0.16)}`,
        })}
      />

      <Box
        component={m.img}
        animate={{ y: [0, -15, 0] }}
        transition={{
          duration: 8,
          ease: 'linear',
          repeat: Infinity,
          repeatDelay: 0,
        }}
        alt="Smoking Penguin"
        src={`${CONFIG.assetsDir}/mint/penguin-smoking.png`}
        sx={{
          right: 0,
          width: 112,
          position: 'absolute',
        }}
      />

      <Box
        sx={{
          display: 'flex',
          position: 'relative',
          flexDirection: 'column',
          alignItems: 'flex-start',
          width: '70%',
        }}
      >
        <Chip
          icon={<Iconify icon="solar:cup-star-bold" sx={{ backgroundColor: "transaprent" }} />}
          variant="filled"
          color="success"
          label="Lvl 8"
          size="small"
        />

        <Box component="span" sx={{ typography: 'h5', color: 'common.black', mt: 0.5 }}>
          High Roller
        </Box>

        <Box
          component="span"
          sx={{
            mb: 2,
            mt: 0.5,
            color: 'common.black',
            typography: 'subtitle2',
          }}
        >
          Upgrade to unlock an additional 15% bonus and 25 FS! 💎
        </Box>

        <Button variant="contained" size="small">
          Upgrade Now
        </Button>
      </Box>
    </Box>
  );
}

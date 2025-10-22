import { useMemo } from 'react';
import type { SxProps, Theme } from '@mint/ui/components/core';
import { Box, ToggleButton, ToggleButtonGroup } from '@mint/ui/components/core';
import { GlassBox, Text } from '@mint/ui/components';
import { Iconify } from '@mint/ui/components/iconify';
import { RouterLink } from '@mint/ui/minimals/routes/components';
import { usePathname } from '@mint/ui/minimals/routes/hooks';
import { paths } from '@/routes/paths';

const CATEGORIES = [
  { icon: 'solar:gamepad-bold', iconWidth: 24, value: paths.casino.root, label: 'Casino Games' },
  { icon: 'games:minty-spins-icon', iconWidth: 24, value: paths.casino.details('minty-spins'), label: 'Minty Spins' },
];

interface GamesMenuProps {
  sx?: SxProps<Theme>;
}

export function GamesMenu({ sx }: GamesMenuProps) {
  const pathname = usePathname();

  const activeCategory = useMemo(() => CATEGORIES.find(
    (c) => pathname === c.value
  )?.value ?? CATEGORIES[0]?.value
    , [pathname]);

  return (
    <GlassBox variant='glass-box' sx={sx}>
      <ToggleButtonGroup exclusive value={activeCategory} fullWidth color="primary">
        {CATEGORIES.map((option) => (
          <ToggleButton
            key={option.label}
            component={RouterLink}
            href={option.value}      // link directly to the pathname
            value={option.value}     // selected based on pathname
            aria-label={option.label}
            color="primary"
            sx={{
              fontWeight: 600
            }}
          >
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, ...(
              activeCategory !== option?.value ? { color: 'var(--text-primary)' } : {}
            ) }}>
              <Iconify width={option.iconWidth} icon={option.icon} />
              <Text variant="subtitle2">{option.label}</Text>
            </Box>
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </GlassBox>
  );
}

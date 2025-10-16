import Image from 'next/image';
import { Text } from '@mint/ui/components';
import { Box, Button } from '@mint/ui/components/core';
import { AnimateBorder } from '@mint/ui/components/animate';
import { Iconify } from '@mint/ui/components/iconify';
import { useFormatBalance } from '@/hooks/useFormatBalance';

export type NavbarHeaderProps = {};

export function NavbarHeaderPlaceholder({ }: NavbarHeaderProps) {
  const { formatBalance } = useFormatBalance();

  return (
    <Box
      sx={{
        position: 'relative',
        zIndex: 'var(--layout-navbar-header-zIndex)',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        padding: 1,
        width: '100%',
        justifyContent: 'end'
      }}

    >
      {/* Center - Invite Button */}
      <Button
        variant="contained"
        color="secondary"
        size="small"
        sx={{ minWidth: 'auto' }}
      >
        <Iconify icon="solar:user-plus-bold" height={30} />
      </Button>

      {/* Right side - Resource counters */}
      <AnimateBorder
      duration={1}
      slotProps={{
        primaryBorder: { size: 60, sx: { color: 'primary.main' } },
      }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          borderRadius: '10px',
          p: 1,
        }}
      >
        {/* MintBucks */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Iconify icon="mint:buck-icon" width={25} />
          <Text
            variant="body2"
            sx={{
              color: 'white',
              fontWeight: 500,
              fontSize: '12px'
            }}
          >
            {formatBalance(0, 'MBX')}
          </Text>
        </Box>

        {/* Raffle Tickets */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Iconify icon="mint:raffle-ticket-icon" height={26} />

          <Text
            variant="body2"
            sx={{
              color: 'white',
              fontWeight: 500,
              fontSize: '12px'
            }}
          >
            {formatBalance(0, 'RTP')}
          </Text>
        </Box>

        {/* XP */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Image alt='ic-xp' src={"/assets/icons/components/ic-xp.svg"} width={20} height={20} />
          <Text
            variant="body2"
            sx={{
              color: 'white',
              fontWeight: 500,
              fontSize: '12px'
            }}
          >
            {formatBalance(0, 'XPP')}
          </Text>
        </Box>
      </AnimateBorder>
    </Box>
  );
}

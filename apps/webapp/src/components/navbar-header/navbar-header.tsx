'use client';

import Image from 'next/image';
import { Box, Button } from '@mint/ui/components/core';
import { GlassBox, InfoDialog, Text } from '@mint/ui/components';
import { useInfoDialog } from '@mint/ui/hooks';
import { Iconify } from '@mint/ui/components/iconify';
import { useFormatBalance } from 'src/hooks/useFormatBalance';
import { useBalances } from 'src/modules/account/session-store';
import { NavbarHeaderPlaceholder } from './navbar-header-placeholder';

// ----------------------------------------------------------------------

export type NavbarHeaderProps = {};

export function NavbarHeader({ }: NavbarHeaderProps) {
  const balances = useBalances();
  const { formatBalance } = useFormatBalance();
  const { isOpen, openDialog, closeDialog, title, content } = useInfoDialog();

  // TODO Temporary lock until we have SSR Session fully functional
  if (!balances.MBX || !balances.RTP || !balances.XPP) {
    return <NavbarHeaderPlaceholder />;
  }

  const mintBucks = (balances.MBX.balanceCents ?? 0) / 100;
  const raffleTickets = (balances.RTP.balanceCents ?? 0) / 100;
  const xp = (balances.XPP.balanceCents ?? 0) / 100;


  const handleInviteClick = () => {

  };

  return (
    <Box
      sx={{
        position: 'relative',
        zIndex: 'var(--layout-navbar-header-zIndex)',
        display: 'flex',
        alignItems: 'center',
        gap: 1.2,
        py: 1,
        width: '100%',
        justifyContent: 'end'
      }}
    >
      {/* Center - Invite Button */}
      <Button
        variant="contained"
        color="secondary"
        onClick={handleInviteClick}
        size="small"
        sx={{ minWidth: 'auto' }}
      >
        <Iconify icon="solar:user-plus-bold" height={30} />
      </Button>

      {/* Right side - Resource counters */}
      <GlassBox
        variant='glass-box'
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          borderRadius: '10px',
          p: 1,
        }}
      >
        {/* MintBucks */}
        <Box data-balance="MBX" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Iconify icon="mint:buck-icon" height={26} />
          <Text
            variant="body2"
            sx={{
              color: 'white',
              fontWeight: 500,
              fontSize: '12px'
            }}
          >
            {formatBalance(mintBucks, 'MBX')}
          </Text>
        </Box>

        {/* Raffle Tickets */}
        <Box data-balance="RTP" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Iconify icon="mint:raffle-ticket-icon" height={26} />

          <Text
            variant="body2"
            sx={{
              color: 'white',
              fontWeight: 500,
              fontSize: '12px'
            }}
          >
            {formatBalance(raffleTickets, 'RTP')}
          </Text>
        </Box>

        {/* XP */}
        <Box data-balance="XPP" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Image alt="ic-xp" src="/assets/icons/components/ic-xp.svg" width={20} height={20} />
          <Text
            variant="body2"
            sx={{
              color: 'white',
              fontWeight: 500,
              fontSize: '12px'
            }}
          >
            {formatBalance(xp, 'XPP')}
          </Text>
        </Box>
      </GlassBox>
      {/* Info Dialog */}
      <InfoDialog
        open={isOpen}
        onClose={closeDialog}
        title={title}
        content={content}
        noCloseBtn
      />
    </Box>
  );
}

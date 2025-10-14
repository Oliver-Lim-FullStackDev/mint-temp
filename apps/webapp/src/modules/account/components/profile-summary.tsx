'use client';

import React, { useMemo } from 'react';
import { useFormatBalance } from '@/hooks/useFormatBalance';
import { useTelegram } from '@/hooks/useTelegram';
import { useSession } from '@/modules/account/session-store';
import { useUserAuth } from '@/modules/telegram/context/user-auth-telegram-provider';
import { useUI } from '@/modules/ui/use-ui';
import { TonConnectButton, useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';
import {
  Avatar,
  Box,
  Button,
  Divider,
  GlassBox,
  Skeleton,
  Stack,
  Typography
} from '@mint/ui';
import { Iconify } from '@mint/ui/components/iconify';
import Image from 'next/image';
import { PROFILE_BACKGROUND_TEXTURE } from '../constants/background-images';
import { useGameResources } from '../hooks/useAccountData';
import { ReferralSection } from './referral-section';

interface ProfileSummaryProps {
  apiConfig?: any;
}

export const ProfileSummary: React.FC<ProfileSummaryProps> = ({ apiConfig }) => {
  const { data: resources } = useGameResources(apiConfig);
  const { user } = useUserAuth();
  const state = useUI();
  const { session } = useSession();
  const { formatBalanceFull } = useFormatBalance();
  const tonAddress = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();
  const isTonConnected = Boolean(tonAddress);

  const balances = useMemo(() => session?.player?.balances, [session?.player?.balances]);

  // Handle wallet disconnection
  const handleDisconnectWallet = () => {
    try {
      // Close the profile dialog first
      if (state.closeAccountDrawer) {
        state.closeAccountDrawer();
      }

      // Attempt disconnect
      if (tonConnectUI) {
        tonConnectUI.disconnect().catch((error) => {
          console.error('Error disconnecting wallet:', error);
        });
      }

      // Refresh the app after a short delay
      setTimeout(() => {
        // Needed because when the wallet is disconnected we get a black screen (TODO: To be investigated deeper)
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error('Error in disconnect handler:', error);
      // Fallback: just refresh the app
      window.location.reload();
    }
  };

  // Handle TON Connect button click - close profile dialog first
  const handleTonConnectClick = () => {
    // Close the profile dialog first to prevent UI conflicts
    if (state.closeAccountDrawer) {
      state.closeAccountDrawer();
    }
    // Small delay to ensure dialog closes before wallet UI opens
    setTimeout(() => {
      if (tonConnectUI) {
        tonConnectUI.connectWallet();
      }
    }, 100);
  };


  // Generate referral link
  const referralLink = useMemo(() => {
    if (!user?.player?.referralId) {
      return;
    }

    const { referralId } = user.player;
    return `${process.env.NEXT_PUBLIC_TELEGRAM_BOT_URL}/?startapp=ref=${referralId}`;

    // TODO migrate to webapp
    // return `${process.env.NEXT_PUBLIC_MINT_URL}/?ref=${referralId}`;
  }, [user?.player?.referralId]);

  const referralCount = user?.player?.referralCount || 0;

  const mintBucks = balances?.MBX?.balanceCents / 100 || 0;
  const raffleTickets = balances?.RTP?.balanceCents / 100 || 0;
  const xp = balances?.XPP?.balanceCents / 100 || 0;

  if (!user) {
    return (
      <Stack spacing={3} alignItems="center" sx={{ p: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" width="100%" sx={{ px: 2 }}>
          <Skeleton variant="rectangular" width={60} height={60} />
          <Skeleton variant="circular" width={100} height={100} />
          <Skeleton variant="rectangular" width={60} height={60} />
        </Stack>
        <Skeleton variant="text" width={120} height={32} />
        <Skeleton variant="rectangular" width="100%" height={60} sx={{ borderRadius: 1.5 }} />
        <Skeleton variant="rectangular" width="100%" height={100} sx={{ borderRadius: 1.5 }} />
      </Stack>
    );
  }

  return (
    <Stack position="relative" spacing={1} alignItems="center" >
      {/* Profile Avatar with Ellipse Shadow */}
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* Ellipse Shadow Background */}
        <Box
          sx={{
            position: 'absolute',
            width: '31rem',
            height: '200px',
            borderRadius: '50%',
            filter: 'blur(0px)',
            zIndex: 0,
            top: '27px',
            background: 'radial-gradient(50% 50% at 50% 50%, #00F1CB 0%, rgba(0, 245, 201, 0) 100%)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: '31rem',
            height: '200px',
            borderRadius: '50%',
            filter: 'blur(0px)',
            zIndex: 0,
            top: '27px',
            opacity: "0.1",
            backgroundImage: `url(${PROFILE_BACKGROUND_TEXTURE})`,
          }}
        />

        {/* Profile Avatar */}
        <Avatar
          src={user?.profileImageUrl || user?.player?.profileImageUrl || '/mint/account-avatar-placeholder.png'}
          alt={user?.displayName || user?.player?.username}
          sx={{
            width: 80,
            height: 80,
            fontSize: '3rem',
            border: '4px solid var(--primary-blue-main, #00F1CB)',
            fontWeight: 'bold',
            backgroundColor: '#D8D9DB',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {user?.displayName?.charAt(0).toUpperCase() || 'M'}
        </Avatar>
      </Box>

      {/* displayName */}
      <Typography variant="h2" zIndex={1} fontSize="2rem !important" textTransform="uppercase" fontWeight="900" textAlign="center" color="text-primary">
        {user?.displayName || user?.player?.username || 'MINT User'}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
          position: 'relative',
          zIndex: 2
        }}
        onClick={!isTonConnected ? handleTonConnectClick : undefined}
      >
        <TonConnectButton />
      </Box>

      {/* Referral Section */}
      {/* <ReferralSection referralCount={referralCount} referralLink={referralLink} shouldHighlight={state.openedFromInvite} /> */}
      {/* XP Level Progress */}
      {/* {xp && (
        <GlassBox
          variant="glass-box"
          sx={{
            width: '100%',
            p: 2,
            borderRadius: 1.5,
            color: 'white',
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="body2" fontWeight="bold" color="text-primary" sx={{ fontSize: '0.875rem' }}>
              ⚡ XP Level {xp.currentLevel}
            </Typography>
            <Typography variant="body2" color="text-primary" fontWeight="bold" sx={{ fontSize: '0.875rem' }}>
              {xp.currentXP.toLocaleString()}/{xp.maxXP.toLocaleString()}
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={xp.levelProgress}
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: '#00F1CB3D',
              '& .MuiLinearProgress-bar': {
                borderRadius: 3,
                background: 'var(--primary-blue-main, #00F1CB)',
              },
            }}
          />
        </GlassBox>
      )} */}

      {/* Game Resources */}
      {resources && (
        <GlassBox
          variant="glass-box"
          sx={{
            width: '100%',
            py: 1,
            borderRadius: 2,
            color: 'white',
          }}
        >
          <Stack direction="row" spacing={0} justifyContent="space-between" alignItems="center">
            <Box sx={{ textAlign: 'center', flex: 1, px: 0 }}>

              <Iconify icon="mint:buck-icon" width={26} />
              <Typography variant="h4" color="text-primary" sx={{ fontSize: '16px !important', mb: 0.5 }}>
                {formatBalanceFull(mintBucks || 0, 'MBX')}
              </Typography>
              <Typography variant="body2" color="text-secondary" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                MintBucks
              </Typography>
            </Box>

            <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mx: 1 }} />

            <Box sx={{ textAlign: 'center', flex: 1, px: 0 }}>

              <Iconify icon="mint:raffle-ticket-icon" width={26} />
              <Typography variant="h4" color="text-primary" sx={{ fontSize: '16px !important', mb: 0.5 }}>
                {formatBalanceFull(raffleTickets || 0, 'RTP')}
              </Typography>
              <Typography variant="body2" color="text-secondary" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                Raffle Tickets
              </Typography>
            </Box>

            <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mx: 1 }} />

            <Box sx={{ textAlign: 'center', flex: 1, px: 0 }}>
              <Image alt='ic-xp' src={"/assets/icons/components/ic-xp.svg"} width={26} height={26} />
              <Typography variant="h4" color="text-primary" sx={{ fontSize: '16px !important', mb: 0.5 }}>
                {formatBalanceFull(xp || 0, 'XPP')}
              </Typography>
              <Typography variant="body2" color="text-secondary" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                XP
              </Typography>
            </Box>
          </Stack>
        </GlassBox>
      )}
    </Stack>
  );
};

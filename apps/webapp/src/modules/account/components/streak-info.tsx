'use client';

import { Text } from '@/components/core';
import {
  Button,
  GlassBox,
  Skeleton,
  Stack,
  styled
} from '@mint/ui';
import { Iconify } from '@mint/ui/components/iconify';
import React from 'react';
import { useStreakInfo } from '../hooks/useAccountData';

// Styled components
const ClaimButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #ffed4e 0%, #ffd700 100%)',
  color: '#000',
  fontWeight: 'bold',
  borderRadius: theme.spacing(3),
  textTransform: 'none',
  '&:hover': {
    background: 'linear-gradient(135deg, #ffd700 0%, #ffb347 100%)',
  },
  '&:disabled': {
    background: 'rgba(255, 255, 255, 0.1)',
    color: 'rgba(255, 255, 255, 0.5)',
  },
}));

interface StreakInfoProps {
  apiConfig?: any;
}


export const StreakInfo: React.FC<StreakInfoProps> = ({ apiConfig }) => {
  const { data: streak, isLoading } = useStreakInfo(apiConfig);

  if (isLoading) {
    return (
      <Stack spacing={2}>
        <Text variant="h6" fontWeight="bold" color="white">
          Streaks
        </Text>
        <GlassBox variant="glass" sx={{ p: 2, borderRadius: 1.5 }}>
          <Stack spacing={2}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Skeleton variant="rectangular" width={60} height={60} sx={{ borderRadius: 1.5 }} />
              <Stack spacing={1} flex={1}>
                <Skeleton variant="rectangular" width={100} height={32} />
              </Stack>
              <Skeleton variant="rectangular" width={80} height={36} />
            </Stack>
          </Stack>
        </GlassBox>
      </Stack>
    );
  }

  if (!streak) {
    return null;
  }

  return (
    <GlassBox variant="glass" sx={{ p: 2.5, borderRadius: 1.5, color: 'white' }}>
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
        {/* Left Section - Streak Count */}
        <Stack direction="row" alignItems="center" spacing={1}>
          <Text variant="h4" fontWeight="bold" sx={{ fontSize: '2rem', color: 'var(--brand-primary-blue-main)' }}>
            {streak.currentStreak || 17}
          </Text>
          <Text variant="body1" color="white" fontWeight="medium">
            Days
          </Text>
        </Stack>

        {/* Center Section - Icons with proper icons */}
        <Stack direction="row" spacing={1} alignItems="center">
          {/* Money Icon */}
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Iconify icon="solar:dollar-minimalistic-bold" sx={{ fontSize: 20, color: 'var(--brand-primary-blue-main)' }} />
            <Text variant="body2" fontWeight="bold" color="white">
              {streak.streakReward?.amount || 51}
            </Text>
          </Stack>
          
          {/* Energy Icon */}
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Iconify icon="solar:lightning-bold" sx={{ fontSize: 20, color: '#FFD700' }} />
            <Text variant="body2" fontWeight="bold" color="white">
              34
            </Text>
          </Stack>
          
          {/* Raffle Ticket Icon */}
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Iconify icon="solar:ticket-bold" sx={{ fontSize: 20, color: '#FF6B6B' }} />
            <Text variant="body2" fontWeight="bold" color="white">
              17
            </Text>
          </Stack>
        </Stack>

        {/* Right Section - Claim Button */}
        <ClaimButton
          variant="contained"
          disabled={!streak.canClaim}
          size="small"
          sx={{
            minWidth: '53px',
            height: '30px',
            borderRadius: 1,
            background: 'var(--brand-primary-blue-main) !important',
            color: 'black',
            fontWeight: '900',
            '&:hover': {
              background: '#00D4B0 !important',
            },
            '&:disabled': {
              background: 'rgba(0, 241, 203, 0.3)',
              color: 'rgba(0, 0, 0, 0.5)',
            },
          }}
        >
          {streak.canClaim ? 'Claim' : 'Claim'}
        </ClaimButton>
      </Stack>
    </GlassBox>
  );
};
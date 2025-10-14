'use client';

import { memo } from 'react';
import { Text } from '@/components/core';
import { Stack, Box } from '@mint/ui';
import { useTheme } from '@mui/material';
import ListItemCoin from './list-item-coin';
import RankCard from './rank-card';


const getRankIcon = (rank: number) => {
  const iconPaths = {
    1: '/assets/icons/leaderboards/first-place.svg',
    2: '/assets/icons/leaderboards/second-place.svg',
    3: '/assets/icons/leaderboards/third-place.svg'
  };
  const glowIconPaths = {
    1: '/assets/icons/profile/glow-1.svg',
    2: '/assets/icons/profile/glow-2.svg',
    3: '/assets/icons/profile/glow-3.svg'
  };

  const iconPath = iconPaths[rank as keyof typeof iconPaths];
  const glowIconPath = glowIconPaths[rank as keyof typeof glowIconPaths];

  if (!iconPath) return null;

  return (
    <div style={{ position: "relative" }}>
      <img
        src={glowIconPath}
        alt={`${rank === 1 ? '1st-g' : rank === 2 ? '2nd-g' : '3rd-g'} place`}
        style={{
          position: "absolute",
          top: '-30px',
          left: "50%",
          transform: "translateX(-50%)",
          width: '160px',
          height: '100px',
          filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
          maxWidth: 'unset',
          borderRadius: 1,

        }}
      />
      <img
        src={iconPath}
        alt={`${rank === 1 ? '1st' : rank === 2 ? '2nd' : '3rd'} place`}
        style={{
          width: '64px',
          height: '58px',
          filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))'
        }}
      />
    </div>
  );
};
export function TopRankedList() {
  const theme = useTheme()
  const topTen = [
    {
      title: "1st",
      label: '1 Year',
      subLabel: 'TG Premium',
      value: 2500,
      awards: [
        { type: 'XPP' as const, amount: 5000 },
        { type: 'MBX' as const, amount: 1000 },
        { type: 'RTP' as const, amount: 10 }
      ]
    },
    {
      title: "2nd",
      label: '3 Months',
      subLabel: 'TG Premium',
      value: 1000,
      awards: [
        { type: 'XPP' as const, amount: 4000 },
        { type: 'MBX' as const, amount: 750 },
        { type: 'RTP' as const, amount: 8 }
      ]
    },
    {
      title: "3rd",
      label: '6 Months',
      subLabel: 'TG Premium',
      value: 1500,
      awards: [
        { type: 'XPP' as const, amount: 3000 },
        { type: 'MBX' as const, amount: 500 },
        { type: 'RTP' as const, amount: 6 }
      ]
    },
    { rank: 4, value: 500, awards: [{ type: 'XPP' as const, amount: 2000 }, { type: 'MBX' as const, amount: 400 }, { type: 'RTP' as const, amount: 4 }, { type: 'STARS' as const, amount: 500 }] },
    { rank: 5, value: 400, awards: [{ type: 'XPP' as const, amount: 1500 }, { type: 'MBX' as const, amount: 300 }, { type: 'RTP' as const, amount: 3 }, { type: 'STARS' as const, amount: 400 }] },
    { rank: 6, value: 300, awards: [{ type: 'XPP' as const, amount: 1000 }, { type: 'MBX' as const, amount: 200 }, { type: 'RTP' as const, amount: 2 }, { type: 'STARS' as const, amount: 300 }] },
    { rank: 7, value: 200, awards: [{ type: 'XPP' as const, amount: 800 }, { type: 'MBX' as const, amount: 150 }, { type: 'STARS' as const, amount: 200 }] },
    { rank: 8, value: 100, awards: [{ type: 'XPP' as const, amount: 600 }, { type: 'MBX' as const, amount: 100 }, { type: 'STARS' as const, amount: 100 }] },
    { rank: 9, value: 0, awards: [{ type: 'XPP' as const, amount: 400 }, { type: 'MBX' as const, amount: 75 }] },
    { rank: 10, value: 0, awards: [{ type: 'XPP' as const, amount: 300 }, { type: 'MBX' as const, amount: 50 }] }
  ];

  return (
    <Stack spacing={1.25}>
      <Stack direction="row" spacing={2} alignItems="end" justifyContent="space-between">
        {/* 2nd Place */}
        <RankCard
          height={280}
          icon={getRankIcon(2)}
          texts={[
            { text: '2nd', variant: 'h3', color: theme.palette.primary.main, fontSize: '32px', fontWeight: 700 },
            { text: '3 Months', variant: 'body2', color: theme.palette.common.white, fontSize: '14px', fontWeight: 700 },
            { text: 'TG Premium', variant: 'body2', color: theme.palette.common.white, fontSize: '12px', fontWeight: 400 },
          ]}
          awards={[
            { type: 'STARS', amount: '1,000', prefix: 'or' },
            { type: 'XPP', amount: '4000', prefix: '+' },
            { type: 'MBX', amount: '750', prefix: '+' },
            { type: 'RTP', amount: '8', prefix: '+' },
          ]}
        />

        {/* 1st Place */}
        <RankCard
          height={280}
          icon={getRankIcon(1)}
          texts={[
            { text: '1st', variant: 'h3', color: theme.palette.primary.main, fontSize: '32px', fontWeight: 700 },
            { text: '1 Year', variant: 'body2', color: theme.palette.common.white, fontSize: '14px', fontWeight: 700 },
            { text: 'TG Premium', variant: 'body2', color: theme.palette.common.white, fontSize: '12px', fontWeight: 400 },
          ]}
          awards={[
            { type: 'STARS', amount: '2,500', prefix: 'or' },
            { type: 'XPP', amount: '5000', prefix: '+' },
            { type: 'MBX', amount: '1000', prefix: '+' },
            { type: 'RTP', amount: '10', prefix: '+' },
          ]}
          isFirst
        />

        {/* 3rd Place */}
        <RankCard
          height={280}
          icon={getRankIcon(3)}
          texts={[
            { text: '3rd', variant: 'h3', color: theme.palette.primary.main, fontSize: '32px', fontWeight: 700 },
            { text: '6 Months', variant: 'body2', color: theme.palette.common.white, fontSize: '14px', fontWeight: 700 },
            { text: 'TG Premium', variant: 'body2', color: theme.palette.common.white, fontSize: '12px', fontWeight: 400 },
          ]}
          awards={[
            { type: 'STARS', amount: '1,500', prefix: 'or' },
            { type: 'XPP', amount: '3000', prefix: '+' },
            { type: 'MBX', amount: '500', prefix: '+' },
            { type: 'RTP', amount: '6', prefix: '+' },
          ]}
        />
      </Stack>

      {/* Bottom section for ranks 4-10 */}
      <Stack spacing={0}>
        {topTen.slice(3).map((item, index) => (
          <Box
            key={index + 4}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            px={2}
            py={0.25}
          >
            {/* Left side - Rank only */}
            <Text sx={{ fontWeight: "600" }} variant='caption'>
              {item.rank}th
            </Text>

            {/* Right side - Icons and amounts */}
            <ListItemCoin
              XPP={item.awards?.find(award => award.type === 'XPP')?.amount || 0}
              MBX={item.awards?.find(award => award.type === 'MBX')?.amount || 0}
              RTP={item.awards?.find(award => award.type === 'RTP')?.amount || 0}
              STARS={item.awards?.find(award => award.type === 'STARS')?.amount || 0}
            />
          </Box>
        ))}
      </Stack>
    </Stack>
  )
}


export default memo(TopRankedList);

'use client';

import { useState } from 'react';
import { GlassBox, Text } from '@mint/ui/components';
import { Avatar, Box, Button, Stack } from '@mint/ui/components/core';
import { Iconify } from '@mint/ui/components/iconify';

// Types
export interface LeadershipUser {
  id: string;
  username: string;
  countFriends: number;
  xpRank: number;
  profilePicture: string;
  rank: number;
}

export interface LeadershipRankingProps {
  users?: LeadershipUser[];
  loadMoreCount?: number;
  onLoadMore?: () => void;
  loading?: boolean;
  currentUser?: LeadershipUser;
}

// Mock data for demonstration
const mockUsers: LeadershipUser[] = [
  {
    id: '1',
    username: 'Klaby.M',
    countFriends: 4187982,
    xpRank: 1,
    profilePicture: '/assets/avatars/avatar-1.jpg',
    rank: 1,
  },
  {
    id: '2',
    username: 'Hoydy22o...',
    countFriends: 3983933,
    xpRank: 2,
    profilePicture: '/assets/avatars/avatar-2.jpg',
    rank: 2,
  },
  {
    id: '3',
    username: 'Plinks88',
    countFriends: 1983222,
    xpRank: 3,
    profilePicture: '/assets/avatars/avatar-3.jpg',
    rank: 3,
  },
  {
    id: '4',
    username: 'MAX',
    countFriends: 182982,
    xpRank: 4,
    profilePicture: '/assets/avatars/avatar-4.jpg',
    rank: 4,
  },
  {
    id: '5',
    username: 'Phillipe',
    countFriends: 189292,
    xpRank: 5,
    profilePicture: '/assets/avatars/avatar-5.jpg',
    rank: 5,
  },
  {
    id: '6',
    username: 'NoFutr',
    countFriends: 87921,
    xpRank: 6,
    profilePicture: '/assets/avatars/avatar-6.jpg',
    rank: 6,
  },
  {
    id: '7',
    username: 'SayHi',
    countFriends: 77117,
    xpRank: 7,
    profilePicture: '/assets/avatars/avatar-7.jpg',
    rank: 7,
  },
  {
    id: '8',
    username: 'BidenKiller',
    countFriends: 55434,
    xpRank: 8,
    profilePicture: '/assets/avatars/avatar-8.jpg',
    rank: 8,
  },
  {
    id: '9',
    username: 'ChadGiga',
    countFriends: 31209,
    xpRank: 9,
    profilePicture: '/assets/avatars/avatar-9.jpg',
    rank: 9,
  },
  {
    id: '10',
    username: 'ChadGiga',
    countFriends: 31209,
    xpRank: 10,
    profilePicture: '/assets/avatars/avatar-10.jpg',
    rank: 10,
  },
];

// Mock current user for demonstration
const mockCurrentUser: LeadershipUser = {
  id: 'current',
  username: 'You',
  countFriends: 120345,
  xpRank: 42,
  profilePicture: '/assets/avatars/avatar-11.jpg',
  rank: 42,
};

// SVG icons for top 3 positions
const getRankIcon = (rank: number) => {
  const iconPaths = {
    1: '/assets/icons/profile/first-icon.svg',
    2: '/assets/icons/profile/second-place-icon.svg',
    3: '/assets/icons/profile/third-place-icon.svg'
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
          width: '100px',
          height: '100px',
          filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
          maxWidth: 'unset',
          borderRadius: "8px",

        }}
      />
      <img
        src={iconPath}
        alt={`${rank === 1 ? '1st' : rank === 2 ? '2nd' : '3rd'} place`}
        style={{
          width: rank === 1 ? '55px' : '45px',
          height: rank === 1 ? '55px' : '40px',
          filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))'
        }}
      />
    </div>
  );
};

const DISPLAY_LIMIT = 9;

export const LeadershipRanking: React.FC<LeadershipRankingProps> = ({
  users = mockUsers,
  loadMoreCount = DISPLAY_LIMIT,
  onLoadMore,
  loading = false,
  currentUser = mockCurrentUser,
}) => {
  const [displayedUsers, setDisplayedUsers] = useState(users.slice(0, loadMoreCount));
  const [hasMore, setHasMore] = useState(users.length > loadMoreCount);

  const handleLoadMore = () => {
    const currentLength = displayedUsers.length;
    const newUsers = users.slice(currentLength, currentLength + loadMoreCount);
    setDisplayedUsers([...displayedUsers, ...newUsers]);
    setHasMore(currentLength + loadMoreCount < users.length);
    onLoadMore?.();
  };

  const topThree = displayedUsers.slice(0, 3);
  const restOfUsers = displayedUsers.slice(3);

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
      <Text
        variant="h6"
        sx={{
          color: '#FF4444',
          fontSize: '18px',
          fontWeight: 700,
          mb: 3,
          textAlign: 'left',
        }}
      >
        TABs XP / Refere
      </Text>

      <GlassBox
        variant="glass"
        sx={{
          width: '100%',
          p: '15px',
          borderRadius: 3,
          backdropFilter: 'blur(10px)',
        }}
      >
        {/* Top 3 Podium */}
        <Stack direction="row" spacing={2} alignItems="end" justifyContent="space-between" mb={4}>
          {/* 2nd Place */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
              mt: 2,
              overflow: 'hidden',
              borderRadius: 1,
            }}
          >
            <Box
              sx={{
                width: 100,
                height: 160,
                borderRadius: '16px',
                background: `
                  linear-gradient(0deg, rgba(20, 28, 37, 0.48), rgba(20, 28, 37, 0.48)),
                  linear-gradient(0deg, rgba(0, 245, 201, 0.14), rgba(0, 245, 201, 0.14))
                `,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'relative',
                p: 1,
              }}
            >
              {getRankIcon(2)}
              <Avatar
                src={topThree[1]?.profilePicture}
                sx={{ width: 32, }}
              />
              <Text
                variant="caption"
                sx={{
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 600,
                  textAlign: 'center',
                  lineHeight: 1,
                }}
              >
                {topThree[1]?.username}
              </Text>
              <FriendCounter count={topThree[1]?.countFriends.toLocaleString()!} />

            </Box>
          </Box>

          {/* 1st Place */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
              borderRadius: 1,
              background: "linear-gradient(0deg, rgba(0, 245, 201, 0.24) 0%, rgba(0, 245, 201, 0.24) 100%), var(--components-backdrop, rgba(18, 28, 38, 0.48));",
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                width: 100,
                height: 180,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'relative',
                p: 1,
              }}
            >
              {getRankIcon(1)}

              <Avatar
                src={topThree[0]?.profilePicture}
                sx={{ width: 40 }}
              />
              <Text
                variant="caption"
                sx={{
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 600,
                  textAlign: 'center',
                  lineHeight: 1,
                }}
              >
                {topThree[0]?.username}
              </Text>
              <FriendCounter count={topThree[0]?.countFriends.toLocaleString()!} />

            </Box>
          </Box>

          {/* 3rd Place */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
              mt: 2,
              overflow: 'hidden',
              borderRadius: 1,
            }}
          >
            <Box
              sx={{
                width: 100,
                height: 150,
                borderRadius: '16px',
                background: `
                  linear-gradient(0deg, rgba(20, 28, 37, 0.48), rgba(20, 28, 37, 0.48)),
                  linear-gradient(0deg, rgba(0, 245, 201, 0.14), rgba(0, 245, 201, 0.14))
                `,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'relative',
                p: 1,
              }}
            >
              {getRankIcon(3)}

              <Avatar
                src={topThree[2]?.profilePicture}
                sx={{ width: 32 }}
              />
              <Text
                variant="caption"
                sx={{
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 600,
                  textAlign: 'center',
                  lineHeight: 1,
                }}
              >
                {topThree[2]?.username}
              </Text>
              <FriendCounter count={topThree[2]?.countFriends.toLocaleString()!} />

            </Box>
          </Box>
        </Stack>

        {/* My Ranking Card */}
        <Box>
          <GlassBox
            variant="glass"
            sx={{
              p: 1,
              borderRadius: 2,
              background: '0px 4px 24px 0px rgba(255, 255, 255, 0.08) inset, 0px 1px 1px 0px rgba(0, 255, 228, 0.25) inset, 0px -1px 1px 0px rgba(0, 0, 0, 0.25) inset, var(--card-x1, 0px) var(--card-y1, 0px) var(--card-blur1, 2px) var(--card-spread1, 0px) var(--shadow-20, rgba(0, 0, 0, 0.20)), var(--card-x2, 0px) var(--card-y2, 12px) var(--card-blur2, 24px) var(--card-spread2, -4px) var(--shadow-12, rgba(0, 0, 0, 0.12)),0px 4px 24px 0px color(display-p3 1 1 1 / 0.08) inset, 0px 1px 1px 0px color(display-p3 0.0886 1 0.8937 / 0.25) inset, 0px -1px 1px 0px color(display-p3 0 0 0 / 0.25) inset, var(--card-x1, 0px) var(--card-y1, 0px) var(--card-blur1, 2px) var(--card-spread1, 0px) var(--shadow-20, color(display-p3 0 0 0 / 0.20)), var(--card-x2, 0px) var(--card-y2, 12px) var(--card-blur2, 24px) var(--card-spread2, -4px) var(--shadow-12, color(display-p3 0 0 0 / 0.12))'
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              {/* Left side - Avatar and info */}
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar
                  src={currentUser.profilePicture}
                  sx={{
                    width: 40,
                    height: 40,
                    border: '1px solid #00F1CB',
                  }}
                />
                <Box>
                  <Text
                    variant="body2"
                    sx={{
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: 600,
                    }}
                  >
                    {currentUser.username}
                  </Text>

                  <FriendCounter count={currentUser.countFriends.toLocaleString()} />
                </Box>
              </Stack>

              {/* Right side - Rank */}
              <Stack alignItems="flex-end" spacing={0.5}>
                <Text
                  variant="h6"
                  sx={{
                    color: 'var(--brand-primary-blue-main)',
                    fontSize: '18px',
                    fontWeight: 700,
                  }}
                >
                  {currentUser.rank}th
                </Text>
              </Stack>
            </Box>
          </GlassBox>
        </Box>

        {/* Rest of the rankings */}
        <Box sx={{ mt: 3 }}>

          <Stack spacing={0}>
            {restOfUsers.map((user) => (
              <Box
                key={user.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 1,
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.03)',
                  },
                }}
              >
                {/* Left side - Avatar and info */}
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar
                    src={user.profilePicture}
                    sx={{
                      width: 40,
                      height: 40,
                    }}
                  />
                  <Box>
                    <Text
                      variant="body2"
                      sx={{
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: 600,
                        mb: 0.25,
                      }}
                    >
                      {user.username}
                    </Text>

                    <FriendCounter count={user.countFriends.toLocaleString()} />
                  </Box>
                </Stack>

                {/* Right side - Rank */}
                <Text
                  variant="h6"
                  sx={{
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: 700,
                  }}
                >
                  {user.rank === 4 ? '4th' :
                    user.rank === 5 ? '5th' :
                      user.rank === 6 ? '6th' :
                        user.rank === 7 ? '7th' :
                          user.rank === 8 ? '8th' :
                            user.rank === 9 ? '9th' :
                              user.rank === 10 ? '10th' : `${user.rank}th`}
                </Text>
              </Box>
            ))}
          </Stack>
        </Box>

        {/* Load More Button */}
        {hasMore && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Button
              onClick={handleLoadMore}
              disabled={loading}
              sx={{
                backgroundColor: 'var(--brand-primary-blue-main)',
                color: '#000',
                fontWeight: 700,
                fontSize: '14px',
                px: 4,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                minWidth: 120,
                '&:hover': {
                  backgroundColor: '#00D4B0',
                },
                '&:disabled': {
                  backgroundColor: 'rgba(0, 241, 203, 0.5)',
                  color: 'rgba(0, 0, 0, 0.5)',
                },
              }}
            >
              {loading ? 'Loading...' : 'Load More'}
            </Button>
          </Box>
        )}
      </GlassBox>
    </Box>
  );
};

export default LeadershipRanking;



export function FriendCounter({ count }: { count: string }) {
  return (
    <Stack direction="row" alignItems="center" spacing={0.5}>
      <Iconify icon="profile-leaderboard:friend-icon" width={30} height={25} sx={{ color: 'var(--brand-primary-blue-main)', mt: '6px' }} />
      <Text
        variant="caption"
        sx={{
          color: 'var(--brand-primary-blue-main)',
          ml: '-12px',
          fontWeight: 600,
        }}
      >
        {count}
      </Text>
    </Stack>
  )
}

export function BalanceCounter({ count, extra }: { count: string, extra?: React.ReactNode }) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5} height={3}>
      {!!extra &&
      <Text
        component="span"
        sx={{
          color: 'var(--warning-light)',
          fontWeight: 600,
        }}
      >
        {extra}
      </Text>}
      <Box display="flex" alignItems="center" justifyContent="space-between">

      <Iconify icon="profile-leaderboard:star-icon" width={30} height={25} sx={{ color: 'var(--brand-primary-blue-main)', mt: '10px' }} />
      <Text
        variant="caption"
        sx={{
          color: 'var(--warning-light)',
          ml: '-12px',
          fontWeight: 600,
        }}
      >
        {count}
      </Text>
      </Box>
    </Stack>
  )
}

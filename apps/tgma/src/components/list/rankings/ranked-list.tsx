'use client';

import { memo, useMemo } from 'react';
import { Text } from '@mint/ui/components';
import { Avatar, Box, CircularProgress } from '@mint/ui/components/core';
import { useTheme } from '@mint/ui/components/core/styles';
import { Iconify } from '@mint/ui/components/iconify';
import { useUserAuth } from '@/modules/telegram/context/user-auth-telegram-provider';
import { useUI } from '@/modules/ui/use-ui';

interface LeaderboardUser {
  id: string;
  username: string;
  profilePicture: string;
  score: number;
  rank: number;
}

export function RankedList({ list = [] }: { list: LeaderboardUser[] }) {
  const { user } = useUserAuth();
  const theme = useTheme()

  // Reorder list to put current user first if found
  const reorderedList = useMemo(() => {
    if (!user?.player?.username || !list.length) return list;

    const currentUserIndex = list.findIndex(item =>
      item.username === user.player?.username ||
      item.id === user.id
    );

    if (currentUserIndex === -1) return list;

    // Move current user to first position
    const currentUser = list[currentUserIndex];
    const otherUsers = list.filter((_, index) => index !== currentUserIndex);

    return [currentUser, ...otherUsers];
  }, [list, user]);

  return (
    <Box
      sx={{
        borderRadius: 3,
        p: 1,
      }}
    >
      {reorderedList?.map((listUser) => {
        const position = listUser?.rank || 0;
        const isCurrentUser = listUser?.username === user?.player?.username || listUser?.id === user?.id;
        const isTheFirstThree = position <= 3;
        return (
          <Box
            key={listUser?.id}
            sx={{
              display: "flex",
              alignItems: "center",
              py: 1,
              mb: isCurrentUser ? 3 : 1,
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            {/* Avatar */}
            <Avatar
              src={listUser?.profilePicture}
              sx={{ width: 40, height: 40, mr: 2 }}
            >
              {listUser?.username?.charAt(0).toUpperCase() || 'M'}
            </Avatar>

            {/* User Info */}
            <Box sx={{ flex: 1}}>
              <Text
                variant="subtitle2"
                sx={{
                  fontWeight: isCurrentUser ? 700 : 600,
                  mb: 0.5,
                  color: isCurrentUser ? theme.palette.primary.main : "inherit",
                }}
              >
                {listUser?.username}{isCurrentUser && ' (You)'}
              </Text>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Iconify icon="mint:buck-icon" height={18} />
                <Text
                  variant="caption"
                  sx={{
                    color: "var(--text-primary)",
                  }}
                >
                  {listUser?.score.toLocaleString()}
                </Text>
              </Box>
            </Box>

            {/* Rank */}
            <Text
              variant="h5"
              sx={{
                color: isTheFirstThree && theme.palette.primary.main || undefined,
                fontWeight: 700,
              }}
            >
              {position === 1
                ? "1st"
                : position === 2
                  ? "2nd"
                  : position === 3
                    ? "3rd"
                    : `${position}th`}
            </Text>
          </Box>
        );
      })}
    </Box>
  );
}



export  function RankedListContent({ loading, list }) {
  const { leaderboardSelectedTab } = useUI();

  // Memoized filtering and sorting calculation
  const filteredUsers = useMemo(() => {
    const now = Date.now();
    const oneMonthAgo = now - (30 * 24 * 60 * 60 * 1000); // 30 days in milliseconds

    let filteredData = list;

    if (leaderboardSelectedTab === 'month') {
      // Filter users updated within the last 30 days
      filteredData = list.filter(user => user.updatedTime >= oneMonthAgo);
    }

    // Sort by score in descending order and update ranks
    return filteredData
      .sort((a, b) => b.score - a.score)
      .map((user, index) => ({ ...user, rank: index + 1 }));
  }, [list, leaderboardSelectedTab]);

  return (
    <Box sx={{ mt: 2 }}>
      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress color='primary' />
        </Box>
      ) : filteredUsers.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Text variant="body1">
            Users are still broke &#128554; ...
          </Text>
        </Box>
      ) : (
        <RankedList list={filteredUsers} />
      )}
    </Box>
  )
}

export default memo(RankedListContent);

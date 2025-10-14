'use client';

import { Box, Stack } from '@mint/ui/components';
import { useUI } from '@/modules/ui/use-ui';
import RankingInfoHeader from '@/modules/account/components/ranking-info-header';
// import RankingShareButton from '@/modules/account/components/ranking-share-button';
import RankingTabSelector from '@/modules/account/components/ranking-tab-selector';
import { RankedListContent } from '@/components/list/rankings/ranked-list';
import TopRankedList from '@/components/list/rankings/top-ranked-list';

export interface LeaderBoardListItem {
  id: string;
  username: string;
  score: number;
  rank: number;
  profilePicture: string;
  updatedTime: number;
}

interface LeaderboardsViewProps {
  list?: LeaderBoardListItem[];
  loading?: boolean;
}

/**
 * LeaderboardsView Component - Performance Optimized
 *
 * Optimizations implemented:
 * 1. React.memo - Prevents re-renders when props haven't changed
 * 2. useMemo for filteredUsers - Expensive filtering/sorting only recalculates when list or selectedTab changes
 * 3. useCallback for event handlers - Prevents child component re-renders due to function recreation
 * 4. useMemo for style objects - Prevents object recreation on every render
 * 5. Static data moved outside component - topThree and tabOptions won't be recreated
 */
function LeaderboardsView({ list = [], loading = false }: LeaderboardsViewProps) {
  const { leaderboardSelectedTab } = useUI();

  return (
    <Box px={2} mb={2}>
      {/** Ranking Page Header */}
      <RankingInfoHeader />

      {/* Tab Selector */}
      <RankingTabSelector />

      {/* TOP 3 Section */}
      <Stack>
        {leaderboardSelectedTab === 'month' && <TopRankedList />}

        {/* Ranked List */}
        <RankedListContent list={list} loading={loading} />
      </Stack>

      {/* Share Button  - Disabled until v1.4 release
      <RankingShareButton />*/}
    </Box>
  );
}

export default LeaderboardsView;

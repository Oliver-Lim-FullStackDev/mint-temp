import { apiFetch } from '@mint/client';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import Loading from './loading';
import LeaderboardsView, { LeaderBoardListItem } from './view';

export const metadata: Metadata = {
  title: 'Rankings',
  description:
    '...',
};


async function getRankings(): Promise<LeaderBoardListItem[]> {
  const rankings = await apiFetch("/missions/rankings", {
    cache: "no-store", // Disable caching if you need fresh data every request
  });

  const topWinners = rankings?.topWinners?.map((e,i) => ({
    id: e[0],
    username: e[0],
    score: e[1],
    rank: i,
    profilePicture: e[2] || '/mint/account-avatar-placeholder.png',
    updatedTime: Date.now()
  })).sort((a, b) => b.score - a.score) || []; // just in case

  return topWinners;
}

export default async function Page() {
  const rankingsList = await getRankings();

  return (
    <Suspense fallback={<Loading />}>
      <LeaderboardsView list={rankingsList} />
    </Suspense>
  );
}

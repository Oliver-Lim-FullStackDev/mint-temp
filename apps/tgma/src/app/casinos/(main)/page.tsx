import type { Metadata } from 'next';
import React from 'react';
import { CasinoView } from '@/app/casinos/(main)/view';
import type { Game } from '@mint/types';
import { apiFetch } from '@mint/client';

export const metadata: Metadata = {
  title: 'Mint.io | Casinos',
  description:
    '...',
};

const DEFAULT_SEARCH_PARAMS = {
  tags: ['mint', 'originals', 'tinyrex'],
  limit: 9999,
};

export default async function Page() {
  let games: Game[] = [];
  let hasError = false;

  try {
    games = await apiFetch<Game[]>('/games/search', {
      method: 'POST',
      body: DEFAULT_SEARCH_PARAMS,
    });
  } catch (error) {
    console.error('Failed to prefetch games list', error);
    hasError = true;
  }

  return <CasinoView games={games} hasError={hasError} />;
}




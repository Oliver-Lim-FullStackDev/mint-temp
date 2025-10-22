import type { Metadata } from 'next';
import React from 'react';
import { notFound } from 'next/navigation';
import { apiFetch } from '@mint/client';
import type { Game } from '@/modules/games/games.types';
import { ErrorPage } from '@/components/error-page';
import { GameView } from './view';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Game',
  description: 'Play now!',
};

// **Use the generated PageProps** from Next’s app folder
type NextPageProps = import('.next/types/app/casino/(games)/game/[slug]/page').PageProps

export default async function Page({ params }: NextPageProps) {
  const { slug: gameParam } = await params;

  // 2. Fetch game metadata
  let game: Game = {} as Game;
  try {
    // game = await apiFetch(`/games/${gameParam}`);
  } catch {
    notFound();
  }

  let initial = null;

  // 3. If this is a Mint game, also fetch init spin & config
  if (game.provider === 'mint') {
    try {
      initial = await apiFetch(`/games/mint/${gameParam}/init`);
    } catch (e: any) {
      // Could show an error page or fallback
      // redirect('/error');
      return <ErrorPage error={e instanceof Error ? e : new Error('Failed to init game')} />;
    }
  }

  // 4. Render the view, passing everything as props
  return (
    <GameView
      game={game}
      initial={initial!}
    />
  );
}

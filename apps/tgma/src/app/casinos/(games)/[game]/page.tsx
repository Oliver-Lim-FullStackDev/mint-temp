import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import type { SlotGameInitDto } from '@/modules/games/components/mint-slots/mint-game-slots.dto';
import type { Game } from '@/modules/games/games.types';
import { apiFetch } from '@mint/client';
import { GameView } from './view';
import { ErrorPage } from '@/components/error-page';


export const metadata: Metadata = {
  title: 'Game',
  description: 'Play now!',
};

// **Use the generated PageProps** from Next’s app folder
type NextPageProps = import('.next/types/app/casinos/(games)/[game]/page').PageProps

export default async function Page({ params }: NextPageProps) {
  const { game: gameParam } = await params;

  // 2. Fetch game metadata
  let game: Game;
  try {
    game = await apiFetch(`/games/${gameParam}`);
  } catch {
    notFound();
  }

  let initial: SlotGameInitDto | null = null;

  // 3. If this is a Mint game, also fetch init spin & config
  if (game.provider === 'mint') {
    try {
      initial = await apiFetch(`/games/${gameParam}/init`);
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

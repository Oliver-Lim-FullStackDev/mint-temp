import { ServerMainLayout } from '@/layouts/web/main/layout.server';
import { MainContentOnlyLayout } from '@/layouts/web/main-content-only/layout';

type NextLayoutProps = import('.next/types/app/casino/(games)/game/[slug]/layout').LayoutProps

// Declare the games that should use MainLayout
const MAIN_LAYOUT_GAMES = new Set<string>(['minty-spins']);

export default async function Layout({ children, params }: NextLayoutProps) {
  const { slug: gameParam } = await params;
  const useMainLayout = MAIN_LAYOUT_GAMES.has(gameParam);

  return useMainLayout ? (
    <ServerMainLayout>{children}</ServerMainLayout>
  ) : (
    <MainContentOnlyLayout>{children}</MainContentOnlyLayout>
  );
}

import type { Metadata } from 'next';
import { CasinoView } from '@/app/casino/(main)/view';
import { loadCasinoInitialData } from '@/app/casino/(main)/loader';

export const metadata: Metadata = {
  title: 'Mint.io | Casinos',
  description: '...',
};

type PageProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

export default async function Page({ searchParams }: PageProps) {
  const { data, hasError } = await loadCasinoInitialData({ searchParams });

  return <CasinoView initialData={data} hasError={hasError} />;
}




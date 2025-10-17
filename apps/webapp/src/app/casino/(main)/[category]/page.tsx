import { CasinoView } from '@/app/casino/(main)/view';
import { loadCasinoInitialData } from '@/app/casino/(main)/loader';

type PageProps = {
  params: { category: string };
  searchParams: Record<string, string | string[] | undefined>;
};

export default async function Page({ params, searchParams }: PageProps) {
  const category = params.category?.toLowerCase();
  const { data, hasError } = await loadCasinoInitialData({ category, searchParams });

  return <CasinoView initialData={data} hasError={hasError} />;
}

import { apiFetch } from '@mint/client';
import type { CasinoApiResponse } from '@/modules/casino';

type LoadParams = {
  category?: string;
  searchParams: Record<string, string | string[] | undefined>;
};

function normaliseParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value ?? undefined;
}

export async function loadCasinoInitialData({ category, searchParams }: LoadParams) {
  const params = new URLSearchParams();

  if (category && category !== 'all') {
    params.set('category', category);
  }

  const search = normaliseParam(searchParams.q)?.trim();
  if (search) {
    params.set('q', search);
  }

  const order = normaliseParam(searchParams.order);
  if (order && order.toUpperCase() === 'DESC') {
    params.set('order', 'DESC');
  }

  const provider = normaliseParam(searchParams.provider);
  if (provider) {
    params.set('provider', provider);
  }

  const query = params.toString();
  const url = query ? `/casino/games?${query}` : '/casino/games';

  try {
    const data = await apiFetch<CasinoApiResponse>(url);
    return { data, hasError: false } as const;
  } catch (error) {
    console.error('Failed to prefetch casino games', error);
    return { data: null, hasError: true } as const;
  }
}

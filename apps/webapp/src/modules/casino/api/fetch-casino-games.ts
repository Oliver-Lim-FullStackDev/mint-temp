import { apiFetch } from '@mint/client';
import { CasinoApiResponse, CasinoQueryParams } from '../types';

function buildQueryString(params: CasinoQueryParams): string {
  const searchParams = new URLSearchParams();

  if (params.category) {
    searchParams.set('category', params.category);
  }

  if (params.search) {
    searchParams.set('q', params.search);
  }

  if (params.order) {
    searchParams.set('order', params.order);
  }

  if (params.provider) {
    searchParams.set('provider', params.provider);
  }

  if (typeof params.limit === 'number') {
    searchParams.set('limit', params.limit.toString());
  }

  if (typeof params.offset === 'number' && params.offset > 0) {
    searchParams.set('offset', params.offset.toString());
  }

  const query = searchParams.toString();

  return query ? `?${query}` : '';
}

export async function fetchCasinoGames(params: CasinoQueryParams): Promise<CasinoApiResponse> {
  const queryString = buildQueryString(params);
  return apiFetch<CasinoApiResponse>(`/casino/games${queryString}`);
}

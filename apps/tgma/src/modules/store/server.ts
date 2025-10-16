import { mintApi } from '@mint/client';
import type { StoreItem } from './types';

export async function getStoreItems(): Promise<StoreItem[]> {
  try {
    const items = await mintApi.get<StoreItem[]>('/store/items');
    return items ?? [];
  } catch (error) {
    console.error('Failed to fetch store items for SSR:', error);
    return [];
  }
}

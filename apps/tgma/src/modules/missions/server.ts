import { mintApi } from '@mint/client';
import type { Campaign } from './hooks/useMissions';

export async function getMissions(): Promise<Campaign[]> {
  try {
    const missions = await mintApi.get<Campaign[]>('/missions');
    return missions ?? [];
  } catch (error) {
    console.error('Failed to fetch missions for SSR:', error);
    return [];
  }
}
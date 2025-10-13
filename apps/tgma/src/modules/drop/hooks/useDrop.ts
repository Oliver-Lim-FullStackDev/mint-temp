import { useQuery } from '@tanstack/react-query';

export interface DropSectionItem {
  id: string;
  title: string;
  exp: number;
  tickets: number;
  label: string;
  actionLabel: string;
}

export interface DropData {
  qualify: DropSectionItem[];
  boosters: DropSectionItem[];
}

async function fetchDrops(): Promise<DropData> {
  const res = await fetch('/api/drops');
  if (!res.ok) throw new Error('Failed to fetch drops');
  return res.json();
}

export function useDrop() {
  return useQuery({
    queryKey: ['drops'],
    queryFn: fetchDrops,
  });
}
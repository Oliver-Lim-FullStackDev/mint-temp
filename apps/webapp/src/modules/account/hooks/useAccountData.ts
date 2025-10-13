'use client';

import { useQuery } from '@tanstack/react-query';

// Types for account data based on Figma design
export interface ProfileStats {
  gamesPlayed: number;
  wins: number;
  profilePicture?: string;
  username: string;
}

export interface XPInfo {
  currentLevel: number;
  currentXP: number;
  maxXP: number;
  levelProgress: number; // percentage 0-100
}

export interface GameResources {
  coins: number;
  raffleTickets: number;
  spins: number;
  xp: number;
}

export interface StreakInfo {
  currentStreak: number;
  maxStreak: number;
  streakReward?: {
    type: 'coins' | 'spins' | 'tickets' | 'raffles';
    amount: number;
  };
  canClaim: boolean;
}

export interface HistoryTransaction {
  id: string;
  date: string;
  type: 'game_play' | 'purchase' | 'raffle' | 'reward';
  description: string;
  dailyPlays?: number;
  raffles?: number;
  coins?: number;
}

export interface PurchaseTransaction {
  id: number;
  date: string;
  item: string;
  amount: string;
  status: string;
}

export interface AccountData {
  profile: ProfileStats;
  xp: XPInfo;
  resources: GameResources;
  streak: StreakInfo;
  history: HistoryTransaction[];
  purchases: PurchaseTransaction[];
}

// Configuration for API endpoints - can be customized
export interface AccountApiConfig {
  baseUrl?: string;
  endpoints: {
    profile: string;
    xp: string;
    resources: string;
    streak: string;
    history: string;
    purchases: string;
  };
  headers?: Record<string, string>;
}

// Default configuration - can be overridden
const defaultApiConfig: AccountApiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_SERVER_URL || '/api',
  endpoints: {
    profile: '/account/profile',
    xp: '/account/xp',
    resources: '/account/resources',
    streak: '/account/streak',
    history: '/account/history',
    purchases: '/account/purchases',
  },
};

// Mock data for development
const mockAccountData: AccountData = {
  profile: {
    gamesPlayed: 132,
    wins: 90,
    username: 'Zak.Minty',
    profilePicture: undefined,
  },
  xp: {
    currentLevel: 2,
    currentXP: 25000,
    maxXP: 50000,
    levelProgress: 50,
  },
  resources: {
    spins: 3,
    coins: 100,
    raffleTickets: 8,
    xp: 2,
  },
  streak: {
    currentStreak: 17,
    maxStreak: 25,
    streakReward: {
      type: 'raffles',
      amount: 2,
    },
    canClaim: true,
  },
  history: [
    {
      id: '1',
      date: '29 Jan 2025',
      type: 'game_play',
      description: 'Game Play',
      dailyPlays: 44,
      raffles: 2,
      coins: 1242,
    },
    {
      id: '2',
      date: '28 Jan 2025',
      type: 'purchase',
      description: 'Purchases',
      dailyPlays: 22,
      raffles: 22,
      coins: 253,
    },
    {
      id: '3',
      date: '27 Jan 2025',
      type: 'game_play',
      description: 'Game Play',
      dailyPlays: 66,
      raffles: 23,
      coins: 366,
    },
    {
      id: '4',
      date: '26 Jan 2025',
      type: 'game_play',
      description: 'Game Play',
      dailyPlays: 70,
      raffles: 1,
      coins: 31,
    },
    {
      id: '5',
      date: '25 Jan 2025',
      type: 'game_play',
      description: 'Game Play',
      dailyPlays: 208,
      raffles: 86,
      coins: 18,
    },
  ],
  purchases: [
    { id: 1, date: '2024-01-15', item: 'Premium Pack', amount: '$9.99', status: 'Completed' },
    { id: 2, date: '2024-01-14', item: 'Coin Bundle', amount: '$4.99', status: 'Completed' },
    { id: 3, date: '2024-01-13', item: 'VIP Access', amount: '$19.99', status: 'Completed' },
    { id: 4, date: '2024-01-12', item: 'Bonus Pack', amount: '$2.99', status: 'Completed' },
    { id: 5, date: '2024-01-11', item: 'Special Offer', amount: '$14.99', status: 'Completed' },
    { id: 6, date: '2024-01-10', item: 'Starter Pack', amount: '$1.99', status: 'Completed' },
    { id: 7, date: '2024-01-09', item: 'Mega Bundle', amount: '$29.99', status: 'Completed' },
    { id: 8, date: '2024-01-08', item: 'Daily Boost', amount: '$3.99', status: 'Completed' },
    { id: 9, date: '2024-01-07', item: 'Lucky Pack', amount: '$7.99', status: 'Completed' },
  ],
};

// Fetch functions
const fetchAccountData = async (config: AccountApiConfig): Promise<AccountData> => {
  // For now, return mock data
  // In production, this would make actual API calls
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockAccountData), 500);
  });

  // Production implementation would look like:
  // const response = await fetch(`${config.baseUrl}${config.endpoints.profile}`, {
  //   headers: config.headers,
  // });
  // return response.json();
};

// Main hook for account data
export const useAccountData = (apiConfig?: Partial<AccountApiConfig>) => {
  const config = { ...defaultApiConfig, ...apiConfig };

  return useQuery({
    queryKey: ['accountData', config],
    queryFn: () => fetchAccountData(config),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Individual hooks for specific data sections
export const useProfileStats = (apiConfig?: Partial<AccountApiConfig>) => {
  const { data, ...rest } = useAccountData(apiConfig);
  return {
    data: data?.profile,
    ...rest,
  };
};

export const useXPInfo = (apiConfig?: Partial<AccountApiConfig>) => {
  const { data, ...rest } = useAccountData(apiConfig);
  return {
    data: data?.xp,
    ...rest,
  };
};

export const useGameResources = (apiConfig?: Partial<AccountApiConfig>) => {
  const { data, ...rest } = useAccountData(apiConfig);
  return {
    data: data?.resources,
    ...rest,
  };
};

export const useStreakInfo = (apiConfig?: Partial<AccountApiConfig>) => {
  const { data, ...rest } = useAccountData(apiConfig);
  return {
    data: data?.streak,
    ...rest,
  };
};

export const useAccountHistory = (apiConfig?: Partial<AccountApiConfig>) => {
  const { data, ...rest } = useAccountData(apiConfig);
  return {
    data: data?.history || [],
    ...rest,
  };
};

export const useAccountPurchases = (apiConfig?: Partial<AccountApiConfig>) => {
  const { data, ...rest } = useAccountData(apiConfig);
  return {
    data: data?.purchases || [],
    ...rest,
  };
};

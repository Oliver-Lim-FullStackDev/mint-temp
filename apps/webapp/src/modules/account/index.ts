// Export all components
export * from './components';

// Export hooks
export * from './hooks/useAccountData';

// Re-export for convenience
export { ProfileSummary, StreakInfo, HistoryTransactions } from './components';
export {
  useAccountData,
  useProfileStats,
  useXPInfo,
  useGameResources,
  useStreakInfo,
  useAccountHistory,
} from './hooks/useAccountData';

export type {
  ProfileStats,
  XPInfo,
  GameResources,
  StreakInfo as StreakInfoType,
  HistoryTransaction,
  AccountData,
  AccountApiConfig,
} from './hooks/useAccountData';
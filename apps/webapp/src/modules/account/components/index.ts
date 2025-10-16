export { HistoryTransactions } from './history-transactions';
export { ProfileSummary } from './profile-summary';
export { ReferralSection } from './referral-section';
export { StreakInfo } from './streak-info';
export { SupportSection } from './support-section';
export { TermsPrivacySection } from './terms-privacy-section';

// Re-export types and hooks for convenience
export type {
  AccountApiConfig, AccountData, GameResources, HistoryTransaction, ProfileStats, StreakInfo as StreakInfoType, XPInfo
} from '../hooks/useAccountData';

export {
  useAccountData, useAccountHistory, useGameResources, useProfileStats, useStreakInfo, useXPInfo
} from '../hooks/useAccountData';

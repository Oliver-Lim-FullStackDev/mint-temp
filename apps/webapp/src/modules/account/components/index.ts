export { AccountMenuDropdown } from './account-menu/account-menu-list';
export { HistoryTransactions } from './history-transactions';
export { ProfileSummary } from './profile-summary';
export { ReferralSection } from './referral-section';
export { StreakInfo } from './streak-info';
export { SupportSection } from './support-section';
export { TermsPrivacySection } from './terms-privacy-section';

// New account info area components
export * from './account-info-area';

// Re-export types and hooks for convenience
export type {
  AccountApiConfig, AccountData, GameResources, HistoryTransaction, ProfileStats, StreakInfo as StreakInfoType, XPInfo
} from '../hooks/useAccountData';

export {
  useAccountData, useAccountHistory, useGameResources, useProfileStats, useStreakInfo, useXPInfo
} from '../hooks/useAccountData';

// Tab selector component
export { TabSelector } from './tab-selector';
export type { TabOption, TabSelectorProps } from './tab-selector';


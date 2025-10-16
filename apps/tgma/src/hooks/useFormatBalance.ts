'use client';

import i18next from 'i18next';
import {
  formatBalance,
  formatBalanceFull,
  formatCurrency,
  formatCompact,
  type BalanceType
} from '../utils/number-formatting';

/**
 * React hook for number formatting that automatically uses the current locale
 * Provides all formatting functions with the current i18next language
 */
export function useFormatBalance() {
  const locale = i18next.language || 'en';

  return {
    formatBalance: (value: number, type: BalanceType) => formatBalance(value, type, locale),
    formatBalanceFull: (value: number, type: BalanceType) => formatBalanceFull(value, type, locale),
    formatCurrency: (value: number, currency: string) => formatCurrency(value, currency, locale),
    formatCompact: (value: number) => formatCompact(value, locale),
  };
}

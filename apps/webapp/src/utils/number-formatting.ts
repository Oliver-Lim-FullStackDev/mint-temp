/**
 * Number formatting utilities for the navbar header
 * Applies specific formatting rules for MBX, Raffle Tickets, and XP
 * Uses native Intl.NumberFormat for full i18n support and compact notation
 */

export type BalanceType = 'MBX' | 'RTP' | 'XPP';

/**
 * Gets the appropriate Intl.NumberFormat locale from i18next language
 * Uses the i18next language directly as it's already properly formatted
 */
export function getNumberFormatLocale(i18nLanguage: string): string {
  return i18nLanguage || 'en';
}

/**
 * Formats MBX (Currency style, 2 decimals)
 * Uses Intl.NumberFormat with compact notation for better i18n support
 * Rules:
 * - 0 – 9,999.99 → full number with 2 decimals (e.g. 532.45, 9,876.00)
 * - 10,000+ → show in compact notation (12.34K, 2.34M, 12.34B)
 * - Always round down (floor) so users don't see more than they actually have
 */
export function formatMBX(value: number, locale: string = 'en-US'): string {
  const numberFormatLocale = getNumberFormatLocale(locale);

  if (value < 10000) {
    // 0 – 9,999.99 → full number with 2 decimals
    return new Intl.NumberFormat(numberFormatLocale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.floor(value * 100) / 100);
  } else {
    // 10,000+ → show in compact notation
    return new Intl.NumberFormat(numberFormatLocale, {
      notation: 'compact',
      maximumFractionDigits: 2,
    }).format(Math.floor(value * 100) / 100);
  }
}

/**
 * Formats Raffle Tickets and XP (Integers, 1 decimal when abbreviated)
 * Uses Intl.NumberFormat with compact notation for better i18n support
 * Rules:
 * - 0 – 9,999 → full integer (532, 9,876)
 * - 10,000+ → show in compact notation (12.3K, 2.3M, 12.3B)
 */
export function formatInteger(value: number, locale: string = 'en-US'): string {
  const numberFormatLocale = getNumberFormatLocale(locale);

  if (value < 10000) {
    // 0 – 9,999 → full integer
    return new Intl.NumberFormat(numberFormatLocale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.floor(value));
  } else {
    // 10,000+ → show in compact notation
    return new Intl.NumberFormat(numberFormatLocale, {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(Math.floor(value));
  }
}

/**
 * Formats a balance value based on its type
 * @param value - The numeric value to format
 * @param type - The type of balance (MBX, RTP, or XPP)
 * @param locale - The locale to use for formatting (defaults to 'en-US')
 * @returns Formatted string according to the type's rules
 */
export function formatBalance(value: number, type: BalanceType, locale: string = 'en-US'): string {
  switch (type) {
    case 'MBX':
      return formatMBX(value, locale);
    case 'RTP':
    case 'XPP':
      return formatInteger(value, locale);
    default:
      return value.toString();
  }
}

/**
 * Formats a balance value with proper number formatting (commas for thousands)
 * This is used for the full display when not abbreviated
 * Uses native Intl.NumberFormat for full i18n support
 */
export function formatBalanceFull(value: number, type: BalanceType, locale: string = 'en-US'): string {
  const numberFormatLocale = getNumberFormatLocale(locale);

  switch (type) {
    case 'MBX':
      // For MBX, show 2 decimal places with proper locale formatting
      return new Intl.NumberFormat(numberFormatLocale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(Math.floor(value * 100) / 100);
    case 'RTP':
    case 'XPP':
      // For integers, show with proper locale formatting
      return new Intl.NumberFormat(numberFormatLocale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(Math.floor(value));
    default:
      return value.toString();
  }
}

/**
 * Utility function to format currency with locale support
 * Example: formatCurrency(1234567.89, 'USD', 'en-US') → "$1,234,567.89"
 */
export function formatCurrency(value: number, currency: string, locale: string = 'en-US'): string {
  const numberFormatLocale = getNumberFormatLocale(locale);

  return new Intl.NumberFormat(numberFormatLocale, {
    style: 'currency',
    currency: currency,
  }).format(value);
}

/**
 * Utility function to format compact numbers with locale support
 * Example: formatCompact(1500000, 'en-US') → "1.5M"
 */
export function formatCompact(value: number, locale: string = 'en-US'): string {
  const numberFormatLocale = getNumberFormatLocale(locale);

  return new Intl.NumberFormat(numberFormatLocale, {
    notation: 'compact',
  }).format(value);
}



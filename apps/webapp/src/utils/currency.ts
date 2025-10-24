/**
 * Currency utilities for icon mapping and display
 */

export type CurrencyType = 'crypto' | 'fiat';

export interface CurrencyInfo {
  code: string;
  name: string;
  type: CurrencyType;
  icon: string;
  displayOrder: number;
}

/**
 * Get the appropriate icon key for a currency
 */
export function getCurrencyIconKey(currency: string, type: CurrencyType): string {
  // For fiat currencies, use flag icons
  if (type === 'fiat') {
    return `flag:${currency.toLowerCase()}`;
  }

  // For crypto currencies, use crypto icons
  const cryptoKeyMap: Record<string, string> = {
    'BTC': 'crypto:btc',
    'ETH': 'crypto:eth',
    'USDT': 'crypto:dai', // fallback if specific USDT icon not present
    'USDC': 'crypto:usdc',
    'BNB': 'crypto:bnb',
    'MATIC': 'crypto:matic',
    'DOGE': 'crypto:doge',
    'SOL': 'crypto:sol',
    'SHIB': 'crypto:shib',
    'TRX': 'crypto:trx',
    'LTC': 'crypto:ltc',
    'BCH': 'crypto:bch',
    'XRP': 'crypto:xrp',
    'LINK': 'crypto:link',
    'ADA': 'crypto:ada',
    'SPN': 'mint:header-wallet', // Custom icon for SPN
    'RTP': 'mint:header-wallet', // Custom icon for RTP
    'XPP': 'mint:header-wallet', // Custom icon for XPP
  };

  return cryptoKeyMap[currency] || 'mint:header-wallet';
}

/**
 * Get currency display name
 */
export function getCurrencyName(currency: string): string {
  const nameMap: Record<string, string> = {
    'USD': 'US Dollar',
    'EUR': 'Euro',
    'JPY': 'Japanese Yen',
    'CAD': 'Canadian Dollar',
    'NZD': 'New Zealand Dollar',
    'BRL': 'Brazilian Real',
    'CNY': 'Chinese Yuan',
    'KRW': 'South Korean Won',
    'IDR': 'Indonesian Rupiah',
    'GBP': 'British Pound',
    'CLP': 'Chilean Peso',
    'MXN': 'Mexican Peso',
    'HKD': 'Hong Kong Dollar',
    'TWD': 'Taiwan Dollar',
    'VND': 'Vietnamese Dong',
    'BTC': 'Bitcoin',
    'ETH': 'Ethereum',
    'USDT': 'Tether USD',
    'USDC': 'USD Coin',
    'BNB': 'Binance Coin',
    'TRX': 'Tronix',
    'DOGE': 'Dogecoin',
    'LTC': 'Litecoin',
    'BCH': 'Bitcoin Cash',
    'XRP': 'Ripple',
    'LINK': 'Chainlink',
    'MATIC': 'Polygon',
    'ADA': 'Cardano',
    'SOL': 'Solana',
    'SHIB': 'Shiba Inu',
    'SPN': 'Spins',
    'RTP': 'RTP',
    'XPP': 'XPP',
  };

  return nameMap[currency] || currency;
}

/**
 * Default currency configuration
 */
export const DEFAULT_CURRENCY_CONFIG: CurrencyInfo[] = [
  // Crypto currencies
  { code: 'BTC', name: 'Bitcoin', type: 'crypto', icon: 'crypto:btc', displayOrder: 1 },
  { code: 'ETH', name: 'Ethereum', type: 'crypto', icon: 'crypto:eth', displayOrder: 2 },
  { code: 'USDT', name: 'Tether USD', type: 'crypto', icon: 'crypto:dai', displayOrder: 3 },
  { code: 'USDC', name: 'USD Coin', type: 'crypto', icon: 'crypto:usdc', displayOrder: 4 },
  { code: 'BNB', name: 'Binance Coin', type: 'crypto', icon: 'crypto:bnb', displayOrder: 5 },
  { code: 'MATIC', name: 'Polygon', type: 'crypto', icon: 'crypto:matic', displayOrder: 6 },
  { code: 'DOGE', name: 'Dogecoin', type: 'crypto', icon: 'crypto:doge', displayOrder: 7 },
  { code: 'SOL', name: 'Solana', type: 'crypto', icon: 'crypto:sol', displayOrder: 8 },
  { code: 'SHIB', name: 'Shiba Inu', type: 'crypto', icon: 'crypto:shib', displayOrder: 9 },
  { code: 'TRX', name: 'Tronix', type: 'crypto', icon: 'crypto:trx', displayOrder: 10 },
  { code: 'LTC', name: 'Litecoin', type: 'crypto', icon: 'crypto:ltc', displayOrder: 11 },
  { code: 'BCH', name: 'Bitcoin Cash', type: 'crypto', icon: 'crypto:bch', displayOrder: 12 },
  { code: 'XRP', name: 'Ripple', type: 'crypto', icon: 'crypto:xrp', displayOrder: 13 },
  { code: 'LINK', name: 'Chainlink', type: 'crypto', icon: 'crypto:link', displayOrder: 14 },
  { code: 'ADA', name: 'Cardano', type: 'crypto', icon: 'crypto:ada', displayOrder: 15 },
  { code: 'SPN', name: 'Spins', type: 'crypto', icon: 'mint:header-wallet', displayOrder: 16 },
  { code: 'RTP', name: 'RTP', type: 'crypto', icon: 'mint:header-wallet', displayOrder: 17 },
  { code: 'XPP', name: 'XPP', type: 'crypto', icon: 'mint:header-wallet', displayOrder: 18 },

  // Fiat currencies
  { code: 'USD', name: 'US Dollar', type: 'fiat', icon: 'flag:usd', displayOrder: 100 },
  { code: 'EUR', name: 'Euro', type: 'fiat', icon: 'flag:eur', displayOrder: 101 },
  { code: 'JPY', name: 'Japanese Yen', type: 'fiat', icon: 'flag:jpy', displayOrder: 102 },
  { code: 'CAD', name: 'Canadian Dollar', type: 'fiat', icon: 'flag:cad', displayOrder: 103 },
  { code: 'NZD', name: 'New Zealand Dollar', type: 'fiat', icon: 'flag:nzd', displayOrder: 104 },
  { code: 'BRL', name: 'Brazilian Real', type: 'fiat', icon: 'flag:brl', displayOrder: 105 },
  { code: 'CNY', name: 'Chinese Yuan', type: 'fiat', icon: 'flag:cny', displayOrder: 106 },
  { code: 'KRW', name: 'South Korean Won', type: 'fiat', icon: 'flag:krw', displayOrder: 107 },
  { code: 'IDR', name: 'Indonesian Rupiah', type: 'fiat', icon: 'flag:idr', displayOrder: 108 },
  { code: 'GBP', name: 'British Pound', type: 'fiat', icon: 'flag:gbp', displayOrder: 109 },
  { code: 'CLP', name: 'Chilean Peso', type: 'fiat', icon: 'flag:clp', displayOrder: 110 },
  { code: 'MXN', name: 'Mexican Peso', type: 'fiat', icon: 'flag:mxn', displayOrder: 111 },
  { code: 'HKD', name: 'Hong Kong Dollar', type: 'fiat', icon: 'flag:hkd', displayOrder: 112 },
  { code: 'TWD', name: 'Taiwan Dollar', type: 'fiat', icon: 'flag:twd', displayOrder: 113 },
  { code: 'VND', name: 'Vietnamese Dong', type: 'fiat', icon: 'flag:vnd', displayOrder: 114 },
];

/**
 * Get currency info by code
 */
export function getCurrencyInfo(code: string): CurrencyInfo | null {
  return DEFAULT_CURRENCY_CONFIG.find(currency => currency.code === code) || null;
}

/**
 * Get all currencies of a specific type
 */
export function getCurrenciesByType(type: CurrencyType): CurrencyInfo[] {
  return DEFAULT_CURRENCY_CONFIG
    .filter(currency => currency.type === type)
    .sort((a, b) => a.displayOrder - b.displayOrder);
}


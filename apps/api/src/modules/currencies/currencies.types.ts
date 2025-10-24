/**
 * Currency type enumeration
 */
export enum CurrencyType {
  CRYPTO = 'crypto',
  FIAT = 'fiat',
}

/**
 * Currency entity representing a supported currency
 */
export interface Currency {
  /**
   * Currency code (e.g., 'BTC', 'USD')
   */
  code: string;

  /**
   * Display name (e.g., 'Bitcoin', 'US Dollar')
   */
  name: string;

  /**
   * Currency type
   */
  type: CurrencyType;

  /**
   * Icon identifier for UI display
   */
  icon: string;

  /**
   * Display order for sorting
   */
  displayOrder: number;

  /**
   * Whether the currency is currently enabled
   */
  enabled: boolean;

  /**
   * Optional network identifier for cryptocurrencies
   */
  network?: string;

  /**
   * Optional symbol for display
   */
  symbol?: string;

  /**
   * Number of decimal places
   */
  decimals?: number;
}

/**
 * Response containing categorized currencies
 */
export interface CurrenciesResponse {
  crypto: Currency[];
  fiat: Currency[];
}


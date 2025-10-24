import { useQuery } from '@tanstack/react-query';
import { mintApi } from '@mint/client';

/**
 * Currency type enumeration
 */
export enum CurrencyType {
  CRYPTO = 'crypto',
  FIAT = 'fiat',
}

/**
 * Currency entity
 */
export interface Currency {
  code: string;
  name: string;
  type: CurrencyType;
  icon: string;
  displayOrder: number;
  enabled: boolean;
  network?: string;
  symbol?: string;
  decimals?: number;
}

/**
 * Categorized currencies response
 */
export interface CurrenciesResponse {
  crypto: Currency[];
  fiat: Currency[];
}

/**
 * Hook options
 */
export interface UseCurrenciesOptions {
  /**
   * Filter by currency type
   */
  type?: CurrencyType;

  /**
   * Whether to only fetch enabled currencies
   * @default true
   */
  enabled?: boolean;
}

const CURRENCIES_QUERY_KEY = 'currencies';

/**
 * Hook to fetch all currencies from the API
 *
 * @example
 * // Get all currencies
 * const { currencies, isLoading } = useCurrencies();
 *
 * @example
 * // Get only crypto currencies
 * const { currencies, isLoading } = useCurrencies({ type: CurrencyType.CRYPTO });
 *
 * @example
 * // Get all currencies including disabled ones
 * const { currencies, isLoading } = useCurrencies({ enabled: false });
 */
export function useCurrencies(options: UseCurrenciesOptions = {}) {
  const { type, enabled = true } = options;

  const queryParams = new URLSearchParams();
  if (type) queryParams.append('type', type);
  if (enabled === false) queryParams.append('enabled', 'false');

  const queryString = queryParams.toString();
  const endpoint = `/currencies${queryString ? `?${queryString}` : ''}`;

  const {
    data: currencies = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Currency[]>({
    queryKey: [CURRENCIES_QUERY_KEY, type, enabled],
    queryFn: async () => {
      return mintApi.get<Currency[]>(endpoint);
    },
    staleTime: 30 * 60 * 1000, // 30 minutes - currencies don't change often
    gcTime: 60 * 60 * 1000, // 1 hour
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    // Data
    currencies,

    // State
    isLoading,
    error: error?.message || null,

    // Actions
    refetch,
  };
}

/**
 * Hook to fetch currencies categorized by type (crypto and fiat)
 *
 * @example
 * const { crypto, fiat, isLoading } = useCurrenciesCategorized();
 */
export function useCurrenciesCategorized(enabledOnly = true) {
  const queryParams = enabledOnly === false ? '?enabled=false' : '';

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<CurrenciesResponse>({
    queryKey: [CURRENCIES_QUERY_KEY, 'categorized', enabledOnly],
    queryFn: async () => {
      return mintApi.get<CurrenciesResponse>(`/currencies/categorized${queryParams}`);
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    // Data
    crypto: data?.crypto || [],
    fiat: data?.fiat || [],
    all: data ? [...data.crypto, ...data.fiat] : [],

    // State
    isLoading,
    error: error?.message || null,

    // Actions
    refetch,
  };
}

/**
 * Hook to fetch a single currency by code
 *
 * @example
 * const { currency, isLoading } = useCurrency('BTC');
 */
export function useCurrency(code?: string) {
  const {
    data: currency,
    isLoading,
    error,
    refetch,
  } = useQuery<Currency | null>({
    queryKey: [CURRENCIES_QUERY_KEY, code],
    queryFn: async () => {
      if (!code) return null;
      return mintApi.get<Currency>(`/currencies/${code.toUpperCase()}`);
    },
    enabled: !!code,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    // Data
    currency,

    // State
    isLoading,
    error: error?.message || null,

    // Actions
    refetch,
  };
}

/**
 * Utility function to get currency icon key
 */
export function getCurrencyIconKey(currency: Currency): string {
  return currency.icon;
}

/**
 * Utility function to get currencies by type from a list
 */
export function getCurrenciesByType(currencies: Currency[], type: CurrencyType): Currency[] {
  return currencies.filter((currency) => currency.type === type);
}


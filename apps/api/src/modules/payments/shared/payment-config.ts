import { PaymentConfig, ProviderConfig, Currency, Provider } from './payment.types';

/**
 * Parse currency-to-provider mapping from environment variable
 * Format: CURRENCY1:PROVIDER1,CURRENCY2:PROVIDER2
 * Example: USDT:txn.pro,TON:ston.fi,USD:epocket
 */
const parseCurrencyMappingFromEnv = (envVar: string | undefined): Partial<Record<string, Provider>> => {
  if (!envVar) return {};

  const mapping: Partial<Record<string, Provider>> = {};
  const pairs = envVar.split(',');

  for (const pair of pairs) {
    const [currency, provider] = pair.split(':').map(s => s.trim());
    if (currency && provider) {
      mapping[currency] = provider as Provider;
    }
  }

  return mapping;
};

/**
 * Environment-based currency to provider mapping
 */
export const getCurrencyProviderMapping = (): Record<string, Provider> => {
  const env = process.env.NODE_ENV || 'development';

  // Base/fallback mapping
  const baseMapping: Record<string, Provider> = {
    // Crypto currencies
    'USDT': 'txn.pro',
    'BTC': 'txn.pro',
    'ETH': 'txn.pro',
    'SOL': 'txn.pro',
    'TON': 'ston.fi',
    'STARS': 'ston.fi',

    // Fiat currencies
    'USD': 'epocket',
    'EUR': 'epocket',
    'TRY': 'epocket',
  };

  // Environment-specific overrides from Railway variables
  const envMappings: Record<string, Partial<Record<string, Provider>>> = {
    development: parseCurrencyMappingFromEnv(process.env.CURRENCY_PROVIDER_MAPPING_DEV),
    test: parseCurrencyMappingFromEnv(process.env.CURRENCY_PROVIDER_MAPPING_TEST),
    production: parseCurrencyMappingFromEnv(process.env.CURRENCY_PROVIDER_MAPPING_PROD),
  };

  const envMapping = envMappings[env] || {};

  // Merge and filter out undefined values
  const merged = {
    ...baseMapping,
    ...envMapping,
  };

  // Filter out any undefined values
  const filtered: Record<string, Provider> = {};
  for (const [currency, provider] of Object.entries(merged)) {
    if (provider) {
      filtered[currency] = provider;
    }
  }

  return filtered;
};

/**
 * Provider configurations
 */
export const getProviderConfigs = (): Record<Provider, ProviderConfig> => ({
  'txn.pro': {
    name: 'txn.pro',
    apiKey: process.env.TXN_API_KEY,
    apiUrl: process.env.TXN_API_URL || (process.env.TXN_ENVIRONMENT === 'production' ? 'https://api.ca.txn.pro' : 'https://api.sandbox.txn.pro'),
    webhookSecret: process.env.TXN_WEBHOOK_SECRET,
    enabled: !!process.env.TXN_API_KEY,
  },
  'ston.fi': {
    name: 'ston.fi',
    apiUrl: process.env.OMNISTON_API_URL || 'wss://omni-ws.ston.fi',
    webhookSecret: process.env.STON_FI_WEBHOOK_SECRET,
    enabled: true, // STON.fi doesn't require API key
  },
  'epocket': {
    name: 'epocket',
    apiKey: process.env.EPOCKET_API_KEY,
    apiUrl: process.env.EPOCKET_API_URL || 'https://api.epocket.com',
    webhookSecret: process.env.EPOCKET_WEBHOOK_SECRET,
    enabled: !!process.env.EPOCKET_API_KEY,
  },
  'rhino.fi': {
    name: 'rhino.fi',
    apiKey: process.env.RHINO_FI_API_KEY,
    apiUrl: process.env.RHINO_FI_API_URL || 'https://api.rhino.fi',
    webhookSecret: process.env.RHINO_FI_WEBHOOK_SECRET,
    enabled: !!process.env.RHINO_FI_API_KEY,
  },
});

/**
 * Get provider for a specific currency
 */
export const getProviderForCurrency = (currency: Currency): Provider => {
  const mapping = getCurrencyProviderMapping();
  const provider = mapping[currency.toUpperCase()];

  if (!provider) {
    throw new Error(`No provider configured for currency: ${currency}`);
  }

  return provider;
};

/**
 * Check if a provider is enabled
 */
export const isProviderEnabled = (provider: Provider): boolean => {
  const configs = getProviderConfigs();
  return configs[provider]?.enabled || false;
};

/**
 * Get provider configuration
 */
export const getProviderConfig = (provider: Provider): ProviderConfig => {
  const configs = getProviderConfigs();
  return configs[provider];
};
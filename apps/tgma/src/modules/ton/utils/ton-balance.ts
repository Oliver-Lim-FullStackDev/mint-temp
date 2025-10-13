// Utility functions to get TON wallet balance with environment-based network detection

export interface TonBalanceResult {
  balance: number;
  currency: string;
  address: string;
  source: string;
  network: 'mainnet' | 'testnet';
  nanoBalance: string;
}

/**
 * Determine if we should use testnet based on environment and address
 */
export function shouldUseTestnet(address?: string): boolean {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isTestnetAddress = Boolean(address?.startsWith('0:') || address?.includes('testnet'));

  return isDevelopment || isTestnetAddress;
}

/**
 * Get TON balance using TON Center API with environment detection
 */
export async function getTonBalanceFromTonCenter(address: string): Promise<TonBalanceResult | null> {
  try {
    const isTestnet = shouldUseTestnet(address);
    // TODO move to .env files
    const baseUrl = isTestnet ? 'https://testnet.toncenter.com' : 'https://toncenter.com';

    console.log(`Fetching TON balance from: ${baseUrl} (${isTestnet ? 'testnet' : 'mainnet'})`);

    const response = await fetch(`${baseUrl}/api/v2/getAddressBalance?address=${address}`);
    const data = await response.json();

    if (data.ok) {
      return {
        balance: Number(data.result) / 1e9, // Convert from nano TON to TON
        currency: 'TON',
        address,
        source: isTestnet ? 'TON Center Testnet' : 'TON Center',
        network: isTestnet ? 'testnet' : 'mainnet',
        nanoBalance: data.result
      };
    }
    return null;
  } catch (error) {
    console.error('TON Center API error:', error);
    return null;
  }
}

/**
 * Get TON balance using TonAPI (Alternative)
 */
export async function getTonBalanceFromTonAPI(address: string): Promise<TonBalanceResult | null> {
  try {
    const isTestnet = shouldUseTestnet(address);
    const baseUrl = isTestnet ? 'https://testnet.toncenter.com' : 'https://toncenter.com';

    const response = await fetch(`${baseUrl}/api/v2/getAddressBalance?address=${address}`);
    const data = await response.json();

    if (data.ok) {
      return {
        balance: Number(data.result) / 1e9,
        currency: 'TON',
        address,
        source: isTestnet ? 'TonAPI Testnet' : 'TonAPI',
        network: isTestnet ? 'testnet' : 'mainnet',
        nanoBalance: data.result
      };
    }
    return null;
  } catch (error) {
    console.error('TonAPI error:', error);
    return null;
  }
}

/**
 * Get TON balance with fallback to multiple APIs
 */
export async function getTonBalanceWithFallback(address: string): Promise<TonBalanceResult | null> {
  // Try TON Center first (most reliable)
  const tonCenterResult = await getTonBalanceFromTonCenter(address);
  if (tonCenterResult) return tonCenterResult;

  // Try TonAPI as fallback
  const tonApiResult = await getTonBalanceFromTonAPI(address);
  if (tonApiResult) return tonApiResult;

  return null;
}

/**
 * Simple function to get TON balance (recommended for most use cases)
 */
export async function getTonBalance(address: string): Promise<number | null> {
  const result = await getTonBalanceFromTonCenter(address);
  return result ? result.balance : null;
}

/**
 * Convert nano TON to TON
 */
export function nanoToTon(nanoTon: string | number): number {
  return Number(nanoTon) / 1e9;
}

/**
 * Convert TON to nano TON
 */
export function tonToNano(ton: number): string {
  return (ton * 1e9).toString();
}

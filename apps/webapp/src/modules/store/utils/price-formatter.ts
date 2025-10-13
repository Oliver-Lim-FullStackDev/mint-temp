import { StorePrice } from '../types';

/**
 * Formats a price object into a display string
 * @param price - The price object with currency as key and amount as value
 * @returns Formatted price string (e.g., "Free", "$10", "5 TON", "5 ⭐")
 */
export function formatPrice(price: StorePrice): string {
  // Check if it's free
  if ((price.usd ?? 0) === 0 && (price.ton ?? 0) === 0) return 'Free';

  // Priority order: USD > TON
  if (price.usd && price.usd > 0) {
    return `$${price.usd}`;
  }

  if (price.ton && price.ton > 0) {
    return `${price.ton.toFixed(2)} TON`;
  }

  return 'Free';
}

/**
 * Formats a price object to show multiple currencies
 * @param price - The price object with currency as key and amount as value
 * @returns Formatted price string showing multiple currencies
 */
export function formatPriceMulti(price: StorePrice): string {
  const parts: string[] = [];

  if (price.usd && price.usd > 0) {
    parts.push(`$${price.usd}`);
  }

  if (price.ton && price.ton > 0) {
    parts.push(`${price.ton.toFixed(2)} TON`);
  }

  if (parts.length === 0) return 'Free';

  return parts.join(' / ');
}
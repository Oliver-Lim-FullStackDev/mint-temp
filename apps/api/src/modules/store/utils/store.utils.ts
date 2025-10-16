/**
 * Extract the number of spins from a store item ID
 * @param itemId - The store item ID (e.g., "3-spins", "10-spins", "100-spins")
 * @returns The number of spins to credit
 */
export function extractSpinsFromItemId(itemId: string): number {
  const match = itemId.match(/^(\d+)-spins?$/);
  if (match && match[1]) {
    return parseInt(match[1], 10);
  }
  const numberMatch = itemId.match(/(\d+)/);
  if (numberMatch && numberMatch[1]) {
    return parseInt(numberMatch[1], 10);
  }
  return 0;
}
// Card style configurations for store items
export const CARD_STYLES = {
  free: {
    borderRadius: '16px',
    background: 'rgba(0, 249, 199, 0.12)',
    boxShadow: `
      0 4px 24px 0 rgba(255, 255, 255, 0.08) inset,
      0 1px 1px 0 rgba(0, 255, 228, 0.25) inset,
      0 -1px 1px 0 rgba(0, 0, 0, 0.25) inset,
      0 0 2px 0 rgba(0, 0, 0, 0.20),
      0 12px 24px -4px rgba(0, 0, 0, 0.12)
    `,
    backdropFilter: 'blur(4px)',
  },
  paid: {
    borderRadius: '16px',
    background: 'rgba(18, 28, 38, 0.48)',
    boxShadow: `
      0 4px 24px 0 rgba(255, 255, 255, 0.08) inset,
      0 1px 1px 0 rgba(0, 255, 228, 0.25) inset,
      0 -1px 1px 0 rgba(0, 0, 0, 0.25) inset,
      0 0 2px 0 rgba(0, 0, 0, 0.20),
      0 12px 24px -4px rgba(0, 0, 0, 0.12)
    `,
    backdropFilter: 'blur(4px)',
  },
} as const;

// Type for card style keys
export type CardStyleKey = keyof typeof CARD_STYLES;

// Function to determine if an item is free
export const isItemFree = (price: Record<string, number>): boolean => {
  return Object.values(price).every(priceValue => priceValue === 0);
};

// Function to get card style based on item price
export const getCardStyle = (price: Record<string, number>) => {
  return isItemFree(price) ? CARD_STYLES.free : CARD_STYLES.paid;
};
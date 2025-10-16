import { StoreItem } from '../types';

export type StoreItemType = 'daily' | 'normal';

export interface ItemState {
  type: StoreItemType;
  canClaim: boolean;
  isClaimed: boolean;
  isLoading: boolean;
  buttonText: string;
}

const DAILY_REWARDS_ITEMS = ['5-spins'];

/**
 * Determines the type of store item based on its ID and price
 */
export function getItemType(item: StoreItem): StoreItemType {
  if (DAILY_REWARDS_ITEMS.includes(item.id) && item.price.usd === 0 && item.price.stars === 0) {
    return 'daily';
  }

  return 'normal';
}

/**
 * Generates button text for store items based on their type and state
 */
export function getItemButtonText(
  item: StoreItem,
  state: {
    canOptInOneTime?: boolean;
    isOptedIn?: boolean;
    hasSpinsReward?: boolean;
    isLoading?: boolean;
  }
): string {
  const itemType = getItemType(item);

  switch (itemType) {
    case 'daily':
      if (state.hasSpinsReward) {
        return 'Free';
      }
      return 'Unavailable';

    case 'normal':
      // For normal items, use the price formatting
      if (item?.price?.usd && item.price.usd > 0) {
        return `$${item.price.usd}`;
      }
      if (item?.price?.stars && item.price.stars > 0) {
        return `${item.price.stars} ⭐`;
      }
      return 'Free';

    default:
      return 'Unavailable';
  }
}

/**
 * Checks if an item is a free item (no cost)
 */
export function isFreeItem(item: StoreItem): boolean {
  return item.price.usd === 0 && item.price.stars === 0;
}

/**
 * Gets the complete item state for rendering
 */
export function getItemState(
  item: StoreItem,
  state: {
    canOptInOneTime?: boolean;
    isOptedIn?: boolean;
    hasSpinsReward?: boolean;
    isLoading?: boolean;
  }
): ItemState {
  const type = getItemType(item);
  const buttonText = getItemButtonText(item, state);

  let canClaim = false;
  let isClaimed = false;

  switch (type) {
    case 'daily':
      canClaim = state.hasSpinsReward || false;
      isClaimed = false; // Daily rewards are never "claimed" permanently
      break;

    case 'normal':
      canClaim = true; // Normal items can always be purchased
      isClaimed = false;
      break;
  }

  return {
    type,
    canClaim,
    isClaimed,
    isLoading: state.isLoading || false,
    buttonText,
  };
}

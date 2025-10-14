import { StoreItem } from '../types';
import { SubProvider } from '../types/sub-provider.enum';
import { getItemType } from './item-types';

export type ModalButtonType = 'daily' | 'stars' | 'ton';

export interface ModalButtonState {
  type: ModalButtonType;
  canClick: boolean;
  isLoading: boolean;
  buttonText: string;
  onClick: () => void;
}

export interface ModalState {
  loading?: boolean;
  isPurchaseLoading?: boolean;
  balancesLoading?: boolean;
  isTonConnected?: boolean;
  tonBalance?: number;
  priceData?: {
    usd: number;
    stars: number;
    ton: number;
    tonPriceUsd: number;
  };
  canClaim?: boolean;
  isActivating?: boolean;
  claimableReward?: any;
}

/**
 * Generates button text for daily reward buttons
 */
export function getDailyButtonText(state: ModalState): string {
  if (state.isActivating) {
    return 'Claiming...';
  }
  if (state.canClaim) {
    return 'Claim';
  }
  return 'Unavailable';
}

/**
 * Generates button text for Stars payment buttons
 */
export function getStarsButtonText(state: ModalState): string {
  if (state.loading) {
    return 'Fetching price...';
  }
  if (state.isPurchaseLoading) {
    return 'Processing...';
  }
  if (state.priceData && !isNaN(state.priceData.stars) && state.priceData.stars > 0) {
    return `Buy for ${state.priceData.stars} Stars`;
  }
  return 'Buy with Stars';
}

/**
 * Generates button text for TON payment buttons
 */
export function getTonButtonText(state: ModalState): string {
  if (state.loading) {
    return 'Fetching price...';
  }
  if (state.balancesLoading) {
    return 'Loading balance...';
  }
  if (state.isPurchaseLoading) {
    return 'Processing...';
  }
  if (state.priceData && !isNaN(state.priceData.ton) && state.priceData.ton > 0) {
    return `Buy for ${state.priceData.ton.toFixed(4)} TON`;
  }
  return 'Buy with TON';
}

/**
 * Checks if TON button should be disabled
 */
export function isTonButtonDisabled(state: ModalState): boolean {
  return !!(state.loading || state.balancesLoading || state.isPurchaseLoading ||
    (state.tonBalance || 0) < (state.priceData?.ton || 0));
}

/**
 * Gets all modal buttons for an item
 */
export function getModalButtons(
  item: StoreItem,
  state: ModalState,
  onPurchase: (paymentMethod: SubProvider) => void,
  onClaimDaily: () => Promise<void>,
  onClose: () => void
): ModalButtonState[] {
  const itemType = getItemType(item);
  const buttons: ModalButtonState[] = [];

  // Handle free items (daily)
  if (item.price.usd === 0 && item.price.stars === 0) {
    if (itemType === 'daily') {
      buttons.push({
        type: 'daily',
        canClick: state.canClaim || false,
        isLoading: state.isActivating || false,
        buttonText: getDailyButtonText(state),
        onClick: async () => {
          if (!state.canClaim) return;
          try {
            await onClaimDaily();
            onClose();
          } catch (error) {
            console.error('❌ Failed to claim daily reward:', error);
          }
        },
      });
    }
  } else {
    // Handle paid items
    buttons.push({
      type: 'stars',
      canClick: !(state.loading || state.isPurchaseLoading),
      isLoading: state.loading || state.isPurchaseLoading || false,
      buttonText: getStarsButtonText(state),
      onClick: () => onPurchase(SubProvider.STARS),
    });

    // Only show TON button if wallet is connected
    if (state.isTonConnected) {
      buttons.push({
        type: 'ton',
        canClick: !(state.loading || state.isPurchaseLoading),
        isLoading: state.loading || state.balancesLoading || state.isPurchaseLoading || false,
        buttonText: getTonButtonText(state),
        onClick: () => onPurchase(SubProvider.TON),
      });
    }
  }

  return buttons;
}

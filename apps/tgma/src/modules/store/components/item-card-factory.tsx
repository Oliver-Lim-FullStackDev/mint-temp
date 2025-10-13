'use client';

import { StoreItem } from '../types';
import { SubProvider } from '../types/sub-provider.enum';
import { getItemType, getItemState } from '../utils/item-types';
import DailyItemCard from './daily-item-card';
import NormalItemCard from './normal-item-card';

interface ItemCardFactoryProps {
  item: StoreItem;
  onPurchase: (item: StoreItem, paymentMethod: SubProvider) => void;
  state: {
    hasSpinsReward?: boolean;
    isLoading?: boolean;
  };
  compact?: boolean;
  sx?: any;
  isPurchaseLoading?: boolean;
}

export default function ItemCardFactory({
  item,
  onPurchase,
  state,
  compact,
  sx,
  isPurchaseLoading = false
}: ItemCardFactoryProps) {
  const itemType = getItemType(item);
  const itemState = getItemState(item, state);

  const commonProps = {
    item,
    onPurchase,
    itemState,
    compact,
    sx,
    isPurchaseLoading,
  };

  switch (itemType) {
    case 'daily':
      return <DailyItemCard {...commonProps} />;

    case 'normal':
      return <NormalItemCard {...commonProps} />;

    default:
      return <NormalItemCard {...commonProps} />;
  }
}

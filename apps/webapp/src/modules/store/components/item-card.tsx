'use client';

import { useInventory } from '@/hooks/useInventory';
import { StoreItem } from '../types';
import { SubProvider } from '../types/sub-provider.enum';
import ItemCardFactory from './item-card-factory';

interface ItemCardProps {
  item: StoreItem;
  onPurchase: (item: StoreItem, paymentMethod: SubProvider) => void;
  compact?: boolean;
  sx?: any;
  isPurchaseLoading?: boolean;
}

export default function ItemCard({ item, onPurchase, compact, sx, isPurchaseLoading = false }: ItemCardProps) {
  const { hasDailyRewards } = useInventory();

  const state = {
    hasSpinsReward: hasDailyRewards,
    isLoading: false,
  };

  return (
    <ItemCardFactory
      item={item}
      onPurchase={onPurchase}
      state={state}
      compact={compact}
      sx={sx}
      isPurchaseLoading={isPurchaseLoading}
    />
  );
}
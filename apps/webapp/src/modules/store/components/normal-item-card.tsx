'use client';

import { Button } from '@mint/ui';
import { StoreItem } from '../types';
import { SubProvider } from '../types/sub-provider.enum';
import BaseItemCard from './base-item-card';
import { ItemState } from '../utils/item-types';
import { formatPrice } from '../utils';

interface NormalItemCardProps {
  item: StoreItem;
  onPurchase: (item: StoreItem, paymentMethod: SubProvider) => void;
  itemState: ItemState;
  compact?: boolean;
  sx?: any;
  isPurchaseLoading?: boolean;
}

export default function NormalItemCard({
  item,
  onPurchase,
  itemState,
  compact,
  sx,
  isPurchaseLoading = false
}: NormalItemCardProps) {
  return (
    <BaseItemCard
      item={item}
      onPurchase={onPurchase}
      itemState={itemState}
      compact={compact}
      sx={sx}
      isPurchaseLoading={isPurchaseLoading}
    >
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{
          height: '30px',
          padding: '0 8px',
          gap: '8px',
          borderRadius: '8px',
          background: '#00F9C7',
          cursor: 'pointer',
        }}
      >
        {formatPrice(item.price)}
      </Button>
    </BaseItemCard>
  );
}

'use client';

import { Button } from '@mint/ui/components/core';
import { StoreItem } from '../types';
import { SubProvider } from '../types/sub-provider.enum';
import BaseItemCard from './base-item-card';
import { ItemState } from '../utils/item-types';
import { use8HourDailyRewards } from 'src/hooks/use8HourDailyRewards';
import CountdownTimer from 'src/components/countdown-timer';

interface DailyItemCardProps {
  item: StoreItem;
  onPurchase: (item: StoreItem, paymentMethod: SubProvider) => void;
  itemState: ItemState;
  compact?: boolean;
  sx?: any;
  isPurchaseLoading?: boolean;
}

export default function DailyItemCard({
  item,
  onPurchase,
  itemState,
  compact,
  sx,
  isPurchaseLoading = false
}: DailyItemCardProps) {
  const {
    canClaim,
    countdown,
    currentSlot,
    isActivating,
  } = use8HourDailyRewards();

  const getButtonText = () => {
    if (isActivating) return 'Claiming...';
    if (canClaim) return 'Claim';
    return 'Unavailable';
  };

  const getButtonStyle = () => {
    if (isActivating) {
      return {
        background: '#666',
        cursor: 'not-allowed',
        opacity: 0.6,
      };
    }

    if (canClaim) {
      return {
        background: '#00F9C7',
        cursor: 'pointer',
        opacity: 1,
      };
    }

    return {
      background: '#666',
      cursor: 'not-allowed',
      opacity: 0.6,
    };
  };

  return (
    <BaseItemCard
      item={item}
      onPurchase={onPurchase}
      itemState={itemState}
      compact={compact}
      sx={sx}
      isPurchaseLoading={isPurchaseLoading}
    >
      {!canClaim && currentSlot ? (
        <CountdownTimer
          countdown={countdown}
          nextSlotHour={currentSlot.hour}
          sx={{ width: '100%' }}
        />
      ) : (
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            height: '30px',
            padding: '0 8px',
            gap: '8px',
            borderRadius: '8px',
            ...getButtonStyle(),
          }}
          disabled={!canClaim || isActivating}
        >
          {getButtonText()}
        </Button>
      )}
    </BaseItemCard>
  );
}

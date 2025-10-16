'use client';

import type { StoreItem } from '../types';
import type { SubProvider } from '../types/sub-provider.enum';

import Image from 'next/image';
import { useTonAddress, TonConnectButton } from '@tonconnect/ui-react';
import { Box, Typography } from '@mint/ui/components/core';
import { GlassDialog } from '@mint/ui/components';
import { use8HourDailyRewards } from '@/hooks/use8HourDailyRewards';
import CountdownTimer from '@/components/countdown-timer';
import { useStoreItemWithPrices } from '../hooks/useStoreItemsWithPrices';
import { getModalButtons, type ModalState } from '../utils/modal-button-types';
import { ModalButtonFactory } from './modal-buttons';
import { getItemType } from '../utils/item-types';

interface PurchaseModalProps {
  item: StoreItem;
  onPurchase: (paymentMethod: SubProvider) => void;
  onClose: () => void;
  open: boolean;
  isPurchaseLoading?: boolean;
  onWalletConnectPending?: (item: StoreItem) => void;
}

export default function PurchaseModal({ item, onPurchase, onClose, open, isPurchaseLoading = false, onWalletConnectPending }: PurchaseModalProps) {
  const tonAddress = useTonAddress();
  const isTonConnected = Boolean(tonAddress);


  // Close modal when TON Connect button is clicked and store the item for later
  const handleTonConnectClick = () => {
    // Notify parent component about pending wallet connection
    if (onWalletConnectPending) {
      onWalletConnectPending(item);
    }
    // Close the modal immediately when TON Connect button is clicked
    onClose();
  };

  const { canClaim, countdown, currentSlot, isActivating, activateReward, claimableReward } = use8HourDailyRewards();

  // Handle new 8-hour daily reward claiming
  const handleClaimDailyReward = async () => {
    if (!claimableReward) return;

    try {
      await activateReward(claimableReward.id.toString());
      onClose();
    } catch (error) {
      console.error('Failed to claim daily reward:', error);
    }
  };

  // Use the hook to fetch item with current prices
  const { data: itemWithPrices, isLoading: loading, error } = useStoreItemWithPrices(open ? item.id : '');

  const showBalances = isTonConnected;

  // Create price data from the item with current prices
  const priceData = itemWithPrices ? {
    usd: itemWithPrices.price.usd || 0,
    stars: itemWithPrices.price.stars || 0,
    ton: itemWithPrices.price.ton || 0,
    tonPriceUsd: itemWithPrices.price.ton && itemWithPrices.price.usd ? itemWithPrices.price.usd / itemWithPrices.price.ton : 0
  } : null;

  // Create modal state
  const modalState: ModalState = {
    loading,
    isPurchaseLoading,
    balancesLoading: false,
    isTonConnected,
    tonBalance: 0,
    priceData: priceData || undefined,
    // Daily rewards
    canClaim,
    isActivating,
    claimableReward,
  };

  // Get modal buttons
  const modalButtons = getModalButtons(
    item,
    modalState,
    onPurchase,
    handleClaimDailyReward,
    onClose
  );

  return (
    <GlassDialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          p: 0,
          maxWidth: 420,
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          boxSizing: 'border-box',
          position: 'relative',
          background: 'var(--background-paper, color(display-p3 0.1294 0.1373 0.1529))',
          boxShadow: '0 4px 24px 0 color(display-p3 1 1 1 / 0.08) inset, 0 1px 1px 0 color(display-p3 0.0886 1 0.8937 / 0.25) inset, 0 -1px 1px 0 color(display-p3 0 0 0 / 0.25) inset, var(--card-x1, 0) var(--card-y1, 0) var(--card-blur1, 2px) var(--card-spread1, 0) var(--shadow-20, color(display-p3 0 0 0 / 0.20)), var(--card-x2, 0) var(--card-y2, 12px) var(--card-blur2, 24px) var(--card-spread2, -4px) var(--shadow-12, color(display-p3 0 0 0 / 0.12))',
          backdropFilter: 'blur(4px)'
        }
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 1,
          cursor: 'pointer',
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: 'rgba(0, 0, 0, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 0.2s',
          '&:hover': {
            background: 'rgba(0, 0, 0, 0.5)',
          },
        }}
        onClick={onClose}
      >
        <Box
          component="span"
          sx={{
            width: 16,
            height: 16,
            position: 'relative',
            '&::before, &::after': {
              content: '""',
              position: 'absolute',
              width: 2,
              height: 16,
              background: '#9CA3AF',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
            },
            '&::before': {
              transform: 'translateX(-50%) rotate(45deg)',
            },
            '&::after': {
              transform: 'translateX(-50%) rotate(-45deg)',
            },
          }}
        />
      </Box>
      <Box sx={{ px: 3, pt: 4, pb: 0 }}>
      </Box>

      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            height: 220,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'stretch',
            borderRadius: 1,
            boxShadow: "0px 4px 24px 0px rgba(255, 255, 255, 0.08) inset, 0px 1px 1px 0px rgba(0, 255, 228, 0.25) inset, 0px -1px 1px 0px rgba(0, 0, 0, 0.25) inset",
            backdropFilter: 'blur(4px)',
            overflow: 'hidden',
            background: 'linear-gradient(180deg, #1a2633 0%, #22334a 100%)',
          }}
        >
          <Image
            src={item.imageUrl || '/assets/images/store/item.png'}
            alt={item.title}
            width={400}
            height={240}
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
          />
        </Box>
      </Box>

      <Box sx={{ px: 3, pb: 3, display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }} >
        <Typography variant="h5" component="h2" sx={{ mb: 1, fontWeight: 800, textAlign: 'left', fontSize: 24 }}>
          {item.title}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'left', fontSize: 15, lineHeight: 1.6 }}>
          Grab a Minty Spins Pack to carry on playing and win more MintBucks, Raffle Tickets and XP!
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, px: 3, pb: 3 }}>
        {/* Check if this is a daily item and show countdown if not claimable */}
        {getItemType(item) === 'daily' && item.price.usd === 0 && item.price.stars === 0 ? (
          !canClaim && currentSlot ? (
            <CountdownTimer
              countdown={countdown}
              nextSlotHour={currentSlot.hour}
              sx={{ width: '100%' }}
            />
          ) : (
            <>
              {modalButtons.map((buttonState, index) => (
                <ModalButtonFactory key={index} buttonState={buttonState} />
              ))}
            </>
          )
        ) : (
          <>
            {modalButtons.map((buttonState, index) => (
              <ModalButtonFactory key={index} buttonState={buttonState} />
            ))}
          </>
        )}

        {/* Show TON Connect button when wallet is not connected and item is not free */}
        {!isTonConnected && (item.price?.usd || 0) > 0 && (
          <Box
            sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}
            onClick={handleTonConnectClick}
          >
            <TonConnectButton />
          </Box>
        )}
      </Box>

    </GlassDialog>
  );
}

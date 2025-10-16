'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';
import { Box } from '@mint/ui/components/core';
import { Typography } from '@mint/ui/components';
import { StoreItem } from '../types';
import { SubProvider } from '../types/sub-provider.enum';
import { getCardStyle } from '../utils/card-styles';
import { ItemState } from '../utils/item-types';
import PurchaseModal from './purchase-modal';

interface BaseItemCardProps {
  item: StoreItem;
  onPurchase: (item: StoreItem, paymentMethod: SubProvider) => void;
  itemState: ItemState;
  compact?: boolean;
  sx?: any;
  isPurchaseLoading?: boolean;
  children?: React.ReactNode;
}

export default function BaseItemCard({
  item,
  onPurchase,
  itemState,
  compact,
  sx,
  isPurchaseLoading = false,
  children
}: BaseItemCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [pendingWalletConnectItem, setPendingWalletConnectItem] = useState<StoreItem | null>(null);

  const tonAddress = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowModal(true);
  };

  const handlePurchase = (paymentMethod: SubProvider) => {
    setShowModal(false);
    onPurchase(item, paymentMethod);
  };

  const handleWalletConnectPending = (pendingItem: StoreItem) => {
    setPendingWalletConnectItem(pendingItem);
  };

  // Listen for wallet connection and reopen modal with pending item
  useEffect(() => {
    if (!tonConnectUI || !pendingWalletConnectItem) return;

    const unsubscribe = tonConnectUI.onStatusChange((walletInfo) => {
      if (walletInfo && pendingWalletConnectItem) {
        // Wallet is connected and we have a pending purchase item
        // Small delay to ensure the wallet connection is fully established
        setTimeout(() => {
          // Reopen the modal with the pending item
          setShowModal(true);
          // Clear the pending item
          setPendingWalletConnectItem(null);
        }, 500);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [tonConnectUI, pendingWalletConnectItem]);

  return (
    <>
      <Box
        onClick={handleCardClick}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          flex: '1 0 0',
          alignSelf: 'stretch',
          cursor: 'pointer',
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'translateY(-2px) scale(1.03)',
          },
          ...getCardStyle(item.price),
          ...sx,
        }}
      >
        <Box
          sx={{
            height: '88px',
            alignSelf: 'stretch',
            borderRadius: '16px 16px 0 0',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Image
            src={item.imageUrl || '/assets/images/store/item.png'}
            alt={item.title}
            fill
            style={{ objectFit: 'cover' }}
          />
        </Box>

        <Box
          sx={{
            display: 'flex',
            padding: '8px',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '8px',
            alignSelf: 'stretch',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              alignSelf: 'stretch',
            }}
          >
            <Typography
              variant="body2"
              sx={{
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 1,
                alignSelf: 'stretch',
                overflow: 'hidden',
                color: '#FFF',
                textAlign: 'center',
                textOverflow: 'ellipsis',
                fontSize: '14px',
                fontStyle: 'normal',
                fontWeight: 400,
                lineHeight: '22px',
                letterSpacing: 0,
              }}
            >
              {item.title}
            </Typography>

            <Typography
              variant="body4"
              sx={{
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 1,
                alignSelf: 'stretch',
                overflow: 'hidden',
                color: '#00F9C7',
                textAlign: 'center',
                textOverflow: 'ellipsis',
                fontSize: '10px',
                fontStyle: 'normal',
                fontWeight: 400,
                lineHeight: '16px',
                letterSpacing: 0,
              }}
            >
              {item.description}
            </Typography>
          </Box>

          {children}
        </Box>
      </Box>

      {showModal && (
        <PurchaseModal
          item={item}
          onPurchase={handlePurchase}
          onClose={() => setShowModal(false)}
          open={showModal}
          isPurchaseLoading={isPurchaseLoading}
          onWalletConnectPending={handleWalletConnectPending}
        />
      )}
    </>
  );
}

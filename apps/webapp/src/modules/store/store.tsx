'use client';

import { InfoDialog } from '@/components/core';
import { PageHeader } from '@/components/headers/page-header';
import { useInfoDialog } from '@/hooks/useInfoDialog';
import { Box, Container } from '@mint/ui/components';
import Loader from '@mint/ui/components/loading-screen/loader';
import { RankingShareButton } from '../account/components/ranking-share-button';
import ErrorState from './components/error-state';
import ItemsList from './components/items-list';
import PurchaseSuccessModal from './components/purchase-success-modal';
import { useStore } from './store.service';
import type { StoreItem } from './types';

type StoreProps = {
  initialItems?: StoreItem[];
};

export default function Store({ initialItems }: StoreProps = {}) {
  const { isOpen, openDialog, closeDialog, title, content } = useInfoDialog();

  const {
    items,
    loading,
    isLoading,
    error,
    modalState,
    telegramInitialized,
    handlePurchase,
    handleRetry,
    handleCloseModal,
    handleClearError,
  } = useStore(true, initialItems);

  if (!telegramInitialized || isLoading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={handleRetry} onClear={handleClearError} />;
  }

  return (
    <Container
      maxWidth="sm"
      sx={{ py: 2, pb: 10, overflow: "visible", position: "relative", px: 2 }}
    >
      {modalState.type === "purchase" &&
        modalState.purchase &&
        modalState.purchase.item && (
          <PurchaseSuccessModal
            currentPurchase={modalState.purchase}
            onClose={handleCloseModal}
          />
        )}


      <Box sx={{ textAlign: "center", mb: 3 }}>
        <PageHeader
          title="Store"
          description="Degens don't stop spinning."
          withBg
          showInfoIcon
          onInfoClick={() => {
            openDialog(
              "Store",
              "Welcome to the Store. Claim your free daily spins every 8 hours, or grab extra packs with Stars or $TON. Use them in Minty Spins to rack up MintBucks (MBX), XP, and Raffle Tickets. More spins, more chances."
            );
          }}
        />
      </Box>

      <Box>
        <ItemsList
          items={items}
          onPurchase={handlePurchase}
          loading={loading}
          isPurchaseLoading={isLoading}
        />
      </Box>

      <InfoDialog
        open={isOpen}
        onClose={closeDialog}
        title={title}
        content={content}
      />
      <Box sx={{ mt: 2 }}>
        <RankingShareButton />
      </Box>
    </Container>
  );
}

'use client';

import { PageHeader } from 'src/components/headers/page-header';
import { InfoDialog } from '@mint/ui/components';
import { useInfoDialog } from '@mint/ui/hooks';
import { Box, Container } from '@mint/ui/components/core';
import { Loader } from '@mint/ui/components/loading-screen';
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
    handlePurchase,
    handleRetry,
    handleCloseModal,
    handleClearError,
  } = useStore(true, initialItems);

  if (loading && items.length === 0) {
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
              "Welcome to the Store. Claim your free daily spins every 8 hours, or grab extra packs with $TON. Use them in Minty Spins to rack up MintBucks (MBX), XP, and Raffle Tickets. More spins, more chances."
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
    </Container>
  );
}

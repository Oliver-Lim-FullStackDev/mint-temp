'use client';

import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Typography
} from '@mint/ui/components/core';
import { useRouter } from 'next/navigation';
import { CurrentPurchaseWithSecret } from '../types';
import { paths } from '@/routes/paths';

interface PurchaseSuccessModalProps {
  currentPurchase: CurrentPurchaseWithSecret;
  onClose: () => void;
}

export default function PurchaseSuccessModal({ currentPurchase, onClose }: PurchaseSuccessModalProps) {
  const router = useRouter();

  if (!currentPurchase.item) return null;

  // Extract spins from item ID for the message
  const getSpinsFromItem = (itemId: string) => {
    const match = itemId.match(/^(\d+)-spins?$/);
    if (match && match[1]) {
      return parseInt(match[1], 10);
    }
    const numberMatch = itemId.match(/(\d+)/);
    if (numberMatch && numberMatch[1]) {
      return parseInt(numberMatch[1], 10);
    }
    return 0;
  };

  const spins = getSpinsFromItem(currentPurchase.item.id);

  const handleGoToMintySpins = () => {
    router.push(paths.casinos.details('minty-spins'));
    onClose();
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        zIndex: 'var(--layout-modal-zIndex, 10003)',
      }}
      PaperProps={{
        sx: {
          borderRadius: 'var(--dialog-radius, 16px)',
          background: 'var(--background-paper, color(display-p3 0.1294 0.1373 0.1529))',
          boxShadow: '0 4px 24px 0 color(display-p3 1 1 1 / 0.08) inset, 0 1px 1px 0 color(display-p3 0.0886 1 0.8937 / 0.25) inset, 0 -1px 1px 0 color(display-p3 0 0 0 / 0.25) inset, var(--card-x1, 0) var(--card-y1, 0) var(--card-blur1, 2px) var(--card-spread1, 0) var(--shadow-20, color(display-p3 0 0 0 / 0.20)), var(--card-x2, 0) var(--card-y2, 12px) var(--card-blur2, 24px) var(--card-spread2, -4px) var(--shadow-12, color(display-p3 0 0 0 / 0.12))',
          backdropFilter: 'blur(4px)',
          position: 'relative',
          overflow: 'hidden'
        }
      }}
    >
      {/* Header with close button */}
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 1,
        }}
      >
        {/* Close Button */}
        <Box
          onClick={onClose}
          sx={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#fff',
            fontSize: '18px',
            fontWeight: 'bold',
            transition: 'background 0.2s',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.2)',
            },
          }}
        >
          ×
        </Box>
      </Box>

      <DialogContent sx={{ p: 4, textAlign: 'center', color: '#fff' }}>
        {/* Celebratory Icon */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4, width: '100%' }}>
          <Typography
            sx={{
              fontSize: '50px',
              fontWeight: 'bold',
              color: '#fff',
              textAlign: 'center',
              width: '100%'
            }}
          >
            🎉
          </Typography>
        </Box>

        {/* Title */}
        <Typography variant="h5" component="h2" sx={{ mb: 1, fontWeight: 800, textAlign: 'center', fontSize: 24 }}>
          Purchase Successful
        </Typography>

        {/* Message */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'center', fontSize: 15, lineHeight: 1.6 }}>
          Your purchase of the {currentPurchase.item.title} has been successful. {spins > 0 ? `${spins} Spins have been credited to your Spin Balance in the Minty Spins game.` : 'Your purchase has been completed successfully.'}
        </Typography>

        {/* Buttons */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center', width: '100%' }}>
          {/* Primary Button - Go To Minty Spins */}
          <Button
            variant="contained"
            onClick={handleGoToMintySpins}
            sx={{
              px: 4,
              py: 1.5,
              background: '#00F1CB',
              color: '#000',
              fontWeight: 600,
              fontSize: '16px',
              borderRadius: '8px',
              textTransform: 'none',
              width: '100%',
              '&:hover': {
                background: '#00D4B3',
              },
            }}
          >
            Go To Minty Spins
          </Button>

          {/* Secondary Button - Close */}
          <Button
            variant="text"
            onClick={onClose}
            sx={{
              color: '#fff',
              fontWeight: 500,
              fontSize: '14px',
              textTransform: 'none',
              width: '100%',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            Close
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

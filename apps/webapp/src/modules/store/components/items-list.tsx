'use client';

import { Grid, Typography, Box, CircularProgress } from '@mint/ui';
import { StoreItem } from '../types';
import { SubProvider } from '../types/sub-provider.enum';
import ItemCard from './item-card';

interface ItemsListProps {
  items: StoreItem[];
  onPurchase: (item: StoreItem, paymentMethod: SubProvider) => void;
  loading: boolean;
  isPurchaseLoading?: boolean;
}

export default function ItemsList({ items, onPurchase, loading, isPurchaseLoading = false }: ItemsListProps) {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (items.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          No items available at the moment.
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={2}>
      {items.map((item) => (
        <Grid key={item.id} size={{ xs: 4, sm: 4, md: 4 }}>
          <ItemCard
            item={item}
            onPurchase={onPurchase}
            sx={{ height: '100%' }}
            isPurchaseLoading={isPurchaseLoading}
          />
        </Grid>
      ))}
    </Grid>
  );
}
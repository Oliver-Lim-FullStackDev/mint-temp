import React from 'react';
import { Store } from '@/modules/store';
import { getStoreItems } from '@/modules/store/server';

export default async function StorePage() {
  const initialItems = await getStoreItems();

  return <Store initialItems={initialItems} />;
}

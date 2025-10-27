export const dynamic = "force-dynamic";

import { Store } from 'src/modules/store';
import { getStoreItems } from 'src/modules/store/server';

export default async function StorePage() {
  const initialItems = await getStoreItems();

  return <Store initialItems={initialItems} />;
}

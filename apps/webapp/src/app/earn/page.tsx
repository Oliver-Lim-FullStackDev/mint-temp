export const dynamic = "force-dynamic";

import { Earn } from '@/modules/missions';
import { getMissions } from '@/modules/missions/server';

export default async function Page() {
  const initialCampaigns = await getMissions();

  return <Earn initialCampaigns={initialCampaigns} />;
}
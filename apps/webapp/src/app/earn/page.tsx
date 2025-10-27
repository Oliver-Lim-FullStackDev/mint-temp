export const dynamic = "force-dynamic";

import { Earn } from 'src/modules/missions';
import { getMissions } from 'src/modules/missions/server';

export default async function Page() {
  const initialCampaigns = await getMissions();

  return <Earn initialCampaigns={initialCampaigns} />;
}

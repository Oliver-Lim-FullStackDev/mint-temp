import type { Metadata } from 'next';

import { CONFIG } from '@mint/ui/global-config';

import { OverviewAppView } from '../../overview-app-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <OverviewAppView />;
}

import type { Metadata } from 'next';

import { NotFoundView } from '@/components/404';
import { CONFIG } from '@mint/ui/global-config';


// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `404 page not found! | Error - ${CONFIG.appName}` };

export default function Page() {
  return <NotFoundView />;
}

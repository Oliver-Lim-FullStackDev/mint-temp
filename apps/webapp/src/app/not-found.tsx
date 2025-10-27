import type { Metadata } from 'next';

import { NotFoundView } from 'src/components/404';
import { CONFIG } from 'src/global-config';


// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `404 page not found! | Error - ${CONFIG.appName}` };

export default function Page() {
  return <NotFoundView />;
}

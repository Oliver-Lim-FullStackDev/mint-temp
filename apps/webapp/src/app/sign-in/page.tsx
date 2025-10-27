import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { SignInView } from './sign-in-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Sign in | Jwt - ${CONFIG.appName}` };

export default function Page() {
  return <SignInView />;
}

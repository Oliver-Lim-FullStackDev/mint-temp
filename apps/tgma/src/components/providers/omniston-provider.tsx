'use client';

import { Omniston, OmnistonProvider } from '@ston-fi/omniston-sdk-react';
import type { ReactNode } from 'react';

interface OmnistonProviderWrapperProps {
  children: ReactNode;
}

const apiUrl = process.env.NEXT_PUBLIC_OMNISTON_API_URL ?? 'wss://omni-ws.ston.fi';

// Keep a singleton across HMR in Next.js
const _global = globalThis as any;
const omniston: Omniston =
  _global.__omniston ?? new Omniston({ apiUrl });
if (!_global.__omniston) _global.__omniston = omniston;

export function OmnistonProviderWrapper({ children }: OmnistonProviderWrapperProps) {
  return <OmnistonProvider omniston={omniston}>{children}</OmnistonProvider>;
}

'use client';

import { OmnistonProvider } from '@ston-fi/omniston-sdk-react';
import { ReactNode } from 'react';

interface OmnistonProviderWrapperProps {
  children: ReactNode;
}

const apiUrl = process.env.NEXT_PUBLIC_OMNISTON_API_URL || 'wss://omni-ws.ston.fi';

export function OmnistonProviderWrapper({ children }: OmnistonProviderWrapperProps) {
  return (
    <OmnistonProvider apiUrl={apiUrl}>
      {children}
    </OmnistonProvider>
  );
}
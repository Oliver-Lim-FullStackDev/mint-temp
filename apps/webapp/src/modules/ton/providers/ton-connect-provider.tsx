'use client';

import { useMemo } from 'react';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

const manifestUrl = process.env.NEXT_PUBLIC_TONCONNECT_MANIFEST_URL!;

interface TonConnectProviderProps {
  children: React.ReactNode;
}

export function TonConnectProvider({ children }: TonConnectProviderProps) {
  // We can add environment-specific configuration here if needed
  const config = useMemo(() => {
    // Determine network based on environment
    const isDevelopment = process.env.NODE_ENV === 'development';
    const network = isDevelopment ? 'testnet' : 'mainnet';

    return {
      manifestUrl,
      // Add better error handling and debugging
      enableAndroidBackHandler: true,
      restoreConnection: true,
      // Add network configuration
      network,
    };
  }, []);

  return (
    <TonConnectUIProvider {...config}>
      {children}
    </TonConnectUIProvider>
  );
}

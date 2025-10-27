import { useEffect } from 'react';
import { getServerSession } from '@mint/client';
import { useShowFiatValues } from 'src/modules/wallet/wallet-store';
import { useSetSession } from 'src/modules/account/session-store';

/**
 * Hook that automatically refetches session data every 5 seconds
 * when "Show FIAT values" is enabled to keep exchange rates updated.
 */
export function useSessionPolling() {
  const showFiatValues = useShowFiatValues();
  const setSession = useSetSession();

  useEffect(() => {
    if (!showFiatValues) {
      return;
    }

    const refetchSession = async () => {
      const session = await getServerSession();
      if (session) {
        setSession(session);
      }
    };

    // Initial fetch
    refetchSession();

    // Set up interval to refetch every 5 seconds
    const intervalId = setInterval(() => {
      refetchSession();
    }, 5000); // 5 seconds

    // Cleanup interval on unmount or when showFiatValues changes
    return () => {
      clearInterval(intervalId);
    };
  }, [showFiatValues, setSession]);
}


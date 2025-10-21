'use client';

import { useUserAuth } from '@/modules/privy/auth/context/user-auth-privy-provider';
import { verifyPrivyAuth } from '@/modules/privy/auth/lib/auth-client';
import { usePrivy } from '@privy-io/react-auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

export const PRIVY_FLAG_KEY = '__privyVerified__';
interface PrivyAuthProviderProps {
  children: ReactNode;
}


/**
 * PrivyAuthProvider
 * - Handles referral data from URL parameters
 * - Watches Privy `authenticated` state using SDK hooks
 * - On first authentication per page load, verifies with backend
 * - Sends referral data and cookies to backend for Hero Gaming authentification
 */
export function PrivyAuthProvider({ children }: PrivyAuthProviderProps) {
  const { authenticated } = usePrivy();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useUserAuth()

  // Store referral data from URL parameters
  useEffect(() => {
    const ref = searchParams.get('ref');
    const referrer = searchParams.get('referrer');
    if (ref || referrer) {
      try {
        localStorage.setItem('mint-referral', JSON.stringify({ ref, referrer }));
      } catch (e) {
        console.error('Failed to store referral data', e);
      }
    }
  }, [searchParams]);

  // Handle authentication verification
  useEffect(() => {
    if (!authenticated || (typeof window !== 'undefined' && (window as any)[PRIVY_FLAG_KEY])) return;

    (async () => {
      try {
        const { ref: referralId, referrer: referrerId } = JSON.parse(localStorage.getItem('mint-referral') || '{}');
        const userData = await verifyPrivyAuth({ referralId: referralId || null, referrerId: referrerId || null });
        
        localStorage.removeItem('mint-referral');

        // Update user context
        setUser(userData);

        // Apply SSR session cookie by rerendering on server
        router.replace(window.location.pathname + window.location.search);
        
        if (typeof window !== 'undefined') (window as any)[PRIVY_FLAG_KEY] = true;
      } catch (err) {
        console.error('Privy verification failed', err);
      }
    })();
  }, [authenticated, router, setUser]);

  return <>{children}</>;
}
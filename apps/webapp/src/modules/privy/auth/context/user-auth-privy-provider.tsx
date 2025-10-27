'use client';

import { useSetSession } from 'src/modules/account/session-store';
import type { User } from 'src/types';
import { getServerSession } from '@mint/client';
import { useSearchParams } from 'next/navigation';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface UserAuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  clearUser: () => void;
  loading: boolean;
  setLoading: (isLoading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

// Create the context with a default value
const UserAuthTonProvider = createContext<UserAuthContextType>({
  user: null,
  setUser: () => { },
  isAuthenticated: false,
  clearUser: () => { },
  loading: false,
  setLoading: () => { },
  error: null,
  setError: () => { },
});

// Custom hook to use the auth context
export const useUserAuth = () => useContext(UserAuthTonProvider);

interface UserAuthProviderProps {
  children: ReactNode;
}

// Provider component that wraps the app and makes auth object available to any child component that calls useUserAuth()
export function UserAuthProvider({ children }: UserAuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const searchParams =  useSearchParams(); // Browser-based

  const [referralId, setReferralId] = useState<string | null>(null);
  const [referrerId, setReferrerId] = useState<string | null>(null);


  // Detect Referral parameters on load
  useEffect(() => {
    let referralId: string | null = null;
    let referrerId: string | null = null;

    // Get referral data from localStorage (stored by ReferralProvider)
    try {
      const storedReferralData = localStorage.getItem('mint-referral');
      if (storedReferralData) {
        const referralData = JSON.parse(storedReferralData);
        referralId = referralData.ref || null;
        referrerId = referralData.referrer || null;
        console.log('Using stored referral data:', referralData);
      }
    } catch (error) {
      console.error('Error reading stored referral data:', error);
    }

    // Fallback: if no stored data, try current search params (for web)
    if (!referralId && !referrerId) {
      referralId = searchParams.get('ref') || null;
      referrerId = searchParams.get('referrer') || null;
    }

    if (referralId) {
      setReferralId(referralId);
    }

    if (referrerId) {
      setReferrerId(referrerId);
    }
  }, [searchParams]);

  // Update localStorage when user changes
  const setSession = useSetSession();
  useEffect(() => {
    if (user) {
      // Set mint-session cookie // Client side before re-sync with server
      if (user?.token) {
        document.cookie = `mint-session=${user.token}; path=/; secure; samesite=strict`;
      }

      // Always re-sync session from server (HttpOnly cookie source of truth)
      (async () => {
        const session = await getServerSession();
        console.info('getServerSession', session);
        if (session) {
          setSession(session);
        }
      })();
    }
  }, [user]);

  // Function to clear the user data
  const clearUser = () => {
    setUser(null);
  };


  // Memoized value of the authentication context
  const value = {
    user,
    setUser,
    isAuthenticated: !!user,
    clearUser,
    loading,
    setLoading,
    error,
    setError,
  };

  // Provide the authentication context to children components
  return (
    <UserAuthTonProvider.Provider value={value}>
      {children}
    </UserAuthTonProvider.Provider>
  );
}

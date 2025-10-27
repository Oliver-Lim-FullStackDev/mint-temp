'use client';

// TODO migrate to webapp
import type { User } from 'src/types';
import type { WebApp } from '@twa-dev/types';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { mintApi } from '@mint/client';
import { useTelegramAuth } from 'src/hooks/useTelegramAuth';

interface UserAuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  clearUser: () => void;
  loading: boolean;
  setLoading: (isLoading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  webAppUser: WebApp | null;
  setWebAppUser: (webApp: WebApp | null) => void;
}

// Create the context with a default value
const UserAuthTelegramContext = createContext<UserAuthContextType>({
  user: null,
  setUser: () => { },
  isAuthenticated: false,
  clearUser: () => { },
  loading: false,
  setLoading: () => { },
  error: null,
  setError: () => { },
  webAppUser: null,
  setWebAppUser: () => { },
});

// Custom hook to use the auth context
export const useUserAuth = () => useContext(UserAuthTelegramContext);

interface UserAuthProviderProps {
  children: ReactNode;
}

// Provider component that wraps the app and makes auth object available to any child component that calls useUserAuth()
export function UserAuthTelegramProvider({ children }: UserAuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [webAppUser, setWebAppUser] = useState<WebApp | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { setError: setTelegramError, setTelegramUser } = useTelegramAuth();
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

  // Function to clear the user data
  const clearUser = () => {
    setUser(null);
  };

  // Check WebApp TG User
  useEffect(() => {
    const init = async () => {
      try {
        // Dynamic import of the TWA SDK
        const WebAppSDK = (await import('@twa-dev/sdk')).default;
        // Get WebApp
        if (WebAppSDK) {
          // Access user data directly from the WebApp object
          setWebAppUser(WebAppSDK);
        } else {
          setTelegramError('No WebApp available from Telegram');
        }
      } catch (e) {
        console.error('Failed to initialize Telegram Web App:', e);
        setTelegramError('Failed to initialize Telegram Web App');
      }
    };
    init();
  }, []);

  useEffect(() => {
    const checkTG = async () => {
      setLoading(true);

      try {
        const tgUser = webAppUser?.initDataUnsafe?.user;
        if (tgUser) {
          const userId = `${tgUser.id}`;
          const initData = webAppUser?.initData;
          const { _referralId, _referrerId } = extractReferralParams(webAppUser?.initDataUnsafe.start_param);
          if (userId && initData) {
            const userData = await telegramRegister(initData, _referralId || referralId, _referrerId || referrerId);
            // Remove ref from localStorage after usage
            localStorage.removeItem('mint-referral');
            setTelegramUser(tgUser);

            // Set user in context
            const user = {
              ...userData,
              displayName: tgUser.first_name || tgUser.username || 'MINT User',
              profileImageUrl : userData?.player?.profileImageUrl || tgUser?.photo_url,
            }
            setUser(user);

            // apply SSR session cookie
            router.replace(window.location.pathname + window.location.search);
          }
        }
      } catch (error) {
        console.error('Failed to register Telegram user:', error);
        setTelegramError('Failed to register Telegram user');
      } finally {
        setLoading(false);
      }
    }
    checkTG();
  }, [webAppUser?.initDataUnsafe, webAppUser?.initData, referralId, referrerId]);


  /**
   * Authenticate a user via Telegram
   * @param initData - The initData from Telegram
   * @param referralId - Optional referralId
   * @param referrer - Optional referrer partner code
   * @returns User data after successful authentication
   */
  const telegramRegister = async (
    initData: string,
    referralId?: string | null,
    referrer?: string | null,
  ): Promise<User> => {
    try {
      const payload: { initData: string; referralId?: string; referrer?: string } = { initData };
      if (referralId) {
        payload.referralId = referralId;
      }

      if (referrer) {
        payload.referrer = referrer;
      }

      const user = await mintApi.post<User | null>(
        '/auth/telegram',
        payload
      );
      if (!user) throw new Error('No user returned from Telegram auth');
      console.log('Received user data from Telegram auth:', user);
      return user;
    } catch (error) {
      console.error('Error authenticating with Telegram:', error);
      throw error;
    }
  }

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
    webAppUser,
    setWebAppUser
  };

  if (!user) {
    return null;
  }

  // Provide the authentication context to children components
  return (
    <UserAuthTelegramContext.Provider value={value}>
      {children}
    </UserAuthTelegramContext.Provider>
  );
}

// Function to extract referral parameters from start_param
function extractReferralParams(startParam?: string): { _referralId: string | null; _referrerId: string | null } {
  if (!startParam) {
    return { _referralId: null, _referrerId: null };
  }

  // Check for simple key=value format (ref=xxxxxx or referrer=xxxxx)
  if (startParam.includes('=')) {
    const [key, value] = startParam.split('=', 2);
    if (key === 'ref' && value) {
      return { _referralId: value, _referrerId: null };
    }
    if (key === 'referrer' && value) {
      return { _referralId: null, _referrerId: value };
    }
  }

  try {
    // Fallback to URLSearchParams format
    const startParams = new URLSearchParams(startParam);
    return {
      _referralId: startParams.get('ref'),
      _referrerId: startParams.get('referrer')
    };
  } catch (fallbackError) {
    console.warn('Failed to parse start_param:', fallbackError);
    return { _referralId: null, _referrerId: null };
  }
}

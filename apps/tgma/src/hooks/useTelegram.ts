'use client';

import { useEffect, useState } from 'react';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

interface UseTelegramReturn {
  initialized: boolean;
  isTelegram: boolean;
  isTelegramFullscreen: boolean;
  isTelegramExpanded: boolean;
  userId: string;
  user: TelegramUser | null;
  error: string | null;
  WebApp: any | null;
}

export function useTelegram(): UseTelegramReturn {
  const [initialized, setInitialized] = useState(false);
  const [isTelegram, setIsTelegram] = useState(false);
  const [isTelegramFullscreen, setIsTelegramFullscreen] = useState(false);
  const [isTelegramExpanded, setIsTelegramExpanded] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [WebApp, setWebApp] = useState<any | null>(null);

  const env = process.env.NODE_ENV;

  useEffect(() => {
    let pollTimer: any = null;

    const initTelegram = async () => {
      try {
        const WebAppSDK = (await import('@twa-dev/sdk')).default;

        const isInTelegram = Boolean(WebAppSDK.initDataUnsafe?.user);
        if (!isInTelegram) {
          setIsTelegram(false);
          setError('This application can only be accessed from within Telegram');
          setInitialized(true);
          return;
        }

        WebAppSDK.ready();
        // might be loaded in landscape though, so check here
        const lockWhenPortrait = () => {
          const isPortrait = window.innerHeight > window.innerWidth;
          if (isPortrait) {
            // now lock orientation
            WebAppSDK.lockOrientation();
            window.removeEventListener('resize', lockWhenPortrait);
            console.log('🔒 Orientation locked to portrait.');
          } else {
            console.log('📱 Waiting for user to rotate to portrait...');
          }
        };

        lockWhenPortrait();
        // Then keep listening until it’s portrait
        window.addEventListener('resize', lockWhenPortrait);


        if (env === 'development') {
          WebAppSDK.expand();
        } else if (!WebAppSDK.isFullscreen) {
          WebAppSDK.requestFullscreen();
        }

        setIsTelegram(true);
        setWebApp(WebAppSDK);
        setIsTelegramExpanded(WebAppSDK.isExpanded);
        setIsTelegramFullscreen(WebAppSDK.isFullscreen);

        const onViewportChanged = (e: any) => {
          console.log('viewport changed', e, 'WebAppSDK', WebAppSDK);
          setIsTelegramExpanded(WebAppSDK.isExpanded);
          setIsTelegramFullscreen(WebAppSDK.isFullscreen);
        };

        WebAppSDK.onEvent('viewportChanged', onViewportChanged);
        WebAppSDK.onEvent('themeChanged', () => onViewportChanged);

        const telegramUser = WebAppSDK.initDataUnsafe.user;
        if (telegramUser) {
          setUser(telegramUser);
          setUserId(telegramUser.id?.toString() || '');
        } else {
          setError('No user data available from Telegram');
        }

        setInitialized(true);
      } catch (e) {
        console.error('Failed to initialize Telegram Web App:', e);
        setError('Failed to initialize Telegram Web App');
        setInitialized(true);
      }
    };

    initTelegram();

    return () => {
      if (pollTimer) clearInterval(pollTimer);
    };
  }, []);

  return {
    initialized,
    isTelegram,
    isTelegramFullscreen,
    isTelegramExpanded,
    userId,
    user,
    error,
    WebApp,
  };
}

'use client';

import { useEffect, type PropsWithChildren } from 'react';
import { useRouter } from '@mint/ui/routes/hooks';
import { UserAuthTelegramProvider } from '@/modules/telegram/context/user-auth-telegram-provider';

import {
  initData,
  miniApp,
  useSignal,
  isTMA,
} from '@telegram-apps/sdk-react';
import { useColorScheme } from '@mint/ui';
import { useLaunchParams } from '@/hooks/useLaunchParams';
import { useTelegramMock } from '@/hooks/useTelegramMock';
import { useClientOnce } from '@/hooks/useClientOnce';
import { setLocale } from '@/core/i18n/locale';
import { init } from '@/core/init';
import { useTheme } from '@mui/material';
import { notFound } from 'next/navigation';

export function TelegramWrapper({ children }: PropsWithChildren) {
  const router = useRouter();

  // SSR protection
  useEffect(() => {
    const checkTMA = async () => {
      const isTelegram = isTMA() && await isTMA('complete', { timeout: 2000 });
      if (!isTelegram) {
        notFound();
      }
    };

    checkTMA();
  }, [router]);

  return (
    <UserAuthTelegramProvider>
      <TelegramAppWrapper>
        {children}
      </TelegramAppWrapper>
    </UserAuthTelegramProvider>
  );
}

function TelegramAppWrapper({ children }: PropsWithChildren) {
  const isDev = process.env.NODE_ENV === 'development';
  const theme = useTheme();

  useTelegramMock(isDev);

  const { searchParams } = useLaunchParams();
  const debug = isDev || !!searchParams?.has('debug');

  useClientOnce(() => {
    (async () => {
      await init(debug);
    })();
  });

  const initDataUser = useSignal(initData.user);

  useEffect(() => {
    if (initDataUser) {
      setLocale(initDataUser.language_code);
    }
  }, [initDataUser]);

  const isAvailable = miniApp.setHeaderColor?.isAvailable();
  const isMounted = miniApp.isMounted?.();

  useEffect(() => {
    if (theme && isAvailable && isMounted) {
      let color = theme.palette.background.default;
      if (color.length === 4) {
        color = '#' + [...color.slice(1)].map(c => c + c).join('');
      }

      miniApp.setHeaderColor(color);
    }
  }, [isAvailable, isMounted, theme]);

  useColorScheme(); // Optional hook side effect

  return (
    <>{children}</>
  );
}

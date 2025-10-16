import React, { cache } from 'react';
import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { getServerSession as _getServerSession } from '@mint/client';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { InitColorSchemeScript } from '@mint/ui/components/core';
import { LocalizationProvider } from '@mint/ui/minimals/locales';
import { I18nProvider } from '@mint/ui/minimals/locales/i18n-provider';
import { detectLanguage } from '@mint/ui/minimals/locales/server';
import { themeConfig, ThemeProvider } from '@mint/ui/minimals/theme';
import { primary } from '@mint/ui/minimals/theme/core/palette';
// TODO Instead of JWT Make this work with TON + Session
import { AuthProvider } from '@mint/ui/minimals/auth/context/jwt';
import { MotionLazy } from '@mint/ui/components/animate/motion-lazy';
import { ProgressBar } from '@mint/ui/components/progress-bar';
import { defaultSettings, SettingsProvider } from '@mint/ui/components/settings';
import { detectSettings } from '@mint/ui/components/settings/server';

import { CONFIG } from '@/global-config';
import { TelegramWrapper } from '@/modules/telegram/components';
import { TonAuthProvider, TonConnectProvider } from '@/modules/ton/providers';
import { sessionStore } from '@/modules/account/session-store';
import { QueryProvider } from '@/providers/query-provider';
import { AuthGuard } from '@/components/auth/auth-guard';
import AppBody from '@/components/app-body';
import { OmnistonProviderWrapper } from '@/components/providers/omniston-provider';

import '@mint/ui/global.css';
import { SessionHydrator } from '@/components/session-hydrator';

// Cache so that it triggers only once on app load
const getServerSession = cache(async () => _getServerSession());

// Font loader must be at module scope
const myFont = localFont({
  src: [
    {
      path: '../../public/fonts/Mattone-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Mattone-Bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Mattone-Black.otf',
      weight: '900',
      style: 'normal',
    },
  ],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: primary.main,
};

export const metadata: Metadata = {
  icons: [
    {
      rel: 'icon',
      url: `${CONFIG.assetsDir}/favicon.ico`,
    },
  ],
};

// ----------------------------------------------------------------------

type RootLayoutProps = {
  children: React.ReactNode;
};

async function getAppConfig() {
  const [lang, settings] = await Promise.all([detectLanguage(), detectSettings()]);

  return {
    lang: lang ?? 'en',
    i18nLang: lang ?? 'en',
    cookieSettings: settings,
    dir: settings.direction,
  };
}


export default async function RootLayout({ children }: RootLayoutProps) {
  const appConfig = await getAppConfig();

  // Get and init session
  const session = await getServerSession();
  sessionStore.setState({ session });
  console.info('token', sessionStore.getState()?.session?.token);

  return (
    <html lang={appConfig.lang} dir={appConfig.dir} suppressHydrationWarning className={myFont.className}>
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MSGD53PH');`,
          }}
        />
        {/* End Google Tag Manager */}

        {/* Preload all fonts for better performance */}
        {/* Mattone Fonts */}
        <link
          rel="preload"
          href="/fonts/Mattone-Regular.otf"
          as="font"
          type="font/otf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Mattone-Bold.otf"
          as="font"
          type="font/otf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Mattone-Black.otf"
          as="font"
          type="font/otf"
          crossOrigin="anonymous"
        />

        {/* Red Hat Display Fonts */}
        <link
          rel="preload"
          href="/fonts/Red_Hat_Display/static/RedHatDisplay-Regular.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Red_Hat_Display/static/RedHatDisplay-Medium.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Red_Hat_Display/static/RedHatDisplay-Bold.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Red_Hat_Display/static/RedHatDisplay-SemiBold.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Red_Hat_Display/static/RedHatDisplay-Light.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />

        {/* Red Hat Text Fonts */}
        <link
          rel="preload"
          href="/fonts/Red_Hat_Text/static/RedHatText-Regular.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Red_Hat_Text/static/RedHatText-Medium.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Red_Hat_Text/static/RedHatText-Bold.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Red_Hat_Text/static/RedHatText-SemiBold.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Red_Hat_Text/static/RedHatText-Light.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />

        {/* Red Hat Mono Fonts */}
        <link
          rel="preload"
          href="/fonts/Red_Hat_Mono/static/RedHatMono-Regular.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Red_Hat_Mono/static/RedHatMono-Medium.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Red_Hat_Mono/static/RedHatMono-Bold.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
      </head>
      <AppBody>
        <SessionHydrator session={session} />

        <InitColorSchemeScript
          defaultMode={themeConfig.defaultMode}
          modeStorageKey={themeConfig.modeStorageKey}
          attribute={themeConfig.cssVariables.colorSchemeSelector}
        />
          <I18nProvider lang={appConfig.i18nLang}>
            <AuthProvider>
              <SettingsProvider
                defaultSettings={defaultSettings}
                cookieSettings={appConfig.cookieSettings}
              >
                <LocalizationProvider>
                  <AppRouterCacheProvider options={{ key: 'css' }}>
                    <ThemeProvider
                      defaultMode={themeConfig.defaultMode}
                      modeStorageKey={themeConfig.modeStorageKey}
                      themeOverrides={{
                        // TODO introduce our theme and put here as overrides
                        components: {
                          MuiButton: {
                            styleOverrides: {
                              contained: {
                                fontWeight: 700,
                              },
                            },
                          },
                        },
                      }}
                    >
                      <MotionLazy>
                        <QueryProvider>
                          <OmnistonProviderWrapper>
                            <TelegramWrapper>
                              <TonConnectProvider>
                                <TonAuthProvider>
                                  <AuthGuard>
                                    <ProgressBar />
                                    {children}
                                  </AuthGuard>
                                </TonAuthProvider>
                              </TonConnectProvider>
                            </TelegramWrapper>
                          </OmnistonProviderWrapper>
                        </QueryProvider>
                      </MotionLazy>
                    </ThemeProvider>
                  </AppRouterCacheProvider>
                </LocalizationProvider>
              </SettingsProvider>
            </AuthProvider>
          </I18nProvider>
      </AppBody>
    </html>
  );
}

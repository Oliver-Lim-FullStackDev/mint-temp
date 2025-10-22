'use client';

import React from 'react';
import { Box } from '@mint/ui/components/core';

type BetbyClient = {
  initialize(options: Record<string, unknown>): void;
  updateOptions(options: Record<string, unknown>): void;
  kill(): void;
};

type ScrollTopButtonPosition = 'left' | 'right';

export type BetbyProps = {
  // Required
  scriptUrl: string;
  brandId: string;
  themeName: string;
  onBannerClick: (data: { link?: string; customAction?: boolean }) => void;
  onLogin: () => void;
  onRecharge: () => void;
  onRegister: () => void;
  onSessionRefresh: () => void;
  onTokenExpired: () => Promise<string | null | undefined> | string | null | undefined;

  // Auth
  token?: string | null;
  sessionToken?: string | null;

  // UI
  cssUrls?: string[];
  fontFamilies?: string[];
  lang?: string;
  url?: string;
  stickyTop?: number;
  betSlipOffsetTop?: number;
  betSlipOffsetBottom?: number;
  betSlipZIndex?: number;
  betSlipButton?: React.ReactNode;
  scrollTopButtonPosition?: ScrollTopButtonPosition;
  scrollToTopButtonVisible?: boolean;

  // Style
  style?: React.CSSProperties;
};

function useScriptOnce(src: string) {
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    // reuse existing script if present
    let s = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
    if (s) {
      if (s.dataset.loaded === 'true') setLoaded(true);
      else s.addEventListener('load', () => setLoaded(true), { once: true });
      return;
    }
    s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.type = 'application/javascript';
    s.addEventListener(
      'load',
      () => {
        s!.dataset.loaded = 'true';
        setLoaded(true);
      },
      { once: true }
    );
    s.addEventListener('error', () => setLoaded(false), { once: true });
    document.head.appendChild(s);
  }, [src]);

  return loaded;
}

const clean = (o: Record<string, unknown>) =>
  Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined && v !== null));

export default function Betby(props: BetbyProps) {
  const {
    brandId,
    themeName,
    cssUrls,
    fontFamilies,
    token,
    sessionToken,
    lang,
    url,
    stickyTop,
    betSlipOffsetTop,
    betSlipOffsetBottom,
    betSlipZIndex,
    betSlipButton,
    scrollTopButtonPosition,
    scrollToTopButtonVisible,
    onBannerClick,
    onLogin,
    onRecharge,
    onRegister,
    onSessionRefresh,
    onTokenExpired,
    style,
  } = props;

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const loaded = useScriptOnce(props.scriptUrl);
  const [client, setClient] = React.useState<BetbyClient | null>(null);
  const [inited, setInited] = React.useState(false);

  // create Betby client once script is ready
  React.useEffect(() => {
    if (!loaded) return;
    const w = window as unknown as { BTRenderer?: new () => BetbyClient };
    if (!w.BTRenderer) return;
    setClient((prev) => prev ?? new w.BTRenderer!());
  }, [loaded]);

  // (re)initialize when auth tokens change
  const prevTokenRef = React.useRef<typeof token>(undefined);
  const prevSessionRef = React.useRef<typeof sessionToken>(undefined);

  React.useEffect(() => {
    if (!client || !containerRef.current) return;

    const authChanged =
      prevTokenRef.current !== token || prevSessionRef.current !== sessionToken;

    if (!inited || authChanged) {
      // kill previous instance if any
      if (inited) client.kill();
      // init fresh
      client.initialize(
        clean({
          betSlipOffsetBottom,
          betSlipOffsetTop,
          betSlipZIndex,
          brand_id: brandId,
          cssUrls,
          fontFamilies,
          token,
          lang,
          scrollTopButtonPosition,
          scrollToTopButtonVisible,
          stickyTop,
          target: containerRef.current,
          themeName,
          url,
          onBannerClick,
          onLogin,
          onRecharge,
          onRegister,
          onRouteChange: undefined, // legacy removed; add if you still consume it
          onSessionRefresh,
          onTokenExpired,
        })
      );
      setInited(true);
      prevTokenRef.current = token;
      prevSessionRef.current = sessionToken;
      return;
    }

    // Live updates that don't require re-init
    client.updateOptions(
      clean({
        betSlipOffsetBottom,
        betSlipOffsetTop,
        betSlipButton,
        stickyTop,
        url,
      })
    );
  }, [
    client,
    containerRef,
    inited,
    brandId,
    themeName,
    cssUrls,
    fontFamilies,
    token,
    sessionToken,
    lang,
    url,
    stickyTop,
    betSlipOffsetTop,
    betSlipOffsetBottom,
    betSlipZIndex,
    betSlipButton,
    scrollTopButtonPosition,
    scrollToTopButtonVisible,
    onBannerClick,
    onLogin,
    onRecharge,
    onRegister,
    onSessionRefresh,
    onTokenExpired,
  ]);

  // cleanup on unmount
  React.useEffect(() => () => client?.kill(), [client]);

  return <Box ref={containerRef} id="betby" style={style} />;
}

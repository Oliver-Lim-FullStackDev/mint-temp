'use client';

import { useEffect } from 'react';
import { useTelegram } from '@/hooks/useTelegram';

export function TelegramSafeTop() {
  const { WebApp } = useTelegram();

  useEffect(() => {
    const wa = WebApp;
    if (!wa) return; // Not in TG or not ready yet

    const plat = String(wa?.platform || '').toLowerCase();
    const isMobile = /ios|android/.test(plat);
    const fallback  = plat.includes('ios') ? 44 : plat.includes('android') ? 48 : 0;
    // see ui/global.css for defaults
    document.documentElement.style.setProperty('--device-top', `${fallback}px`);
  }, [WebApp]);

  return null;
}

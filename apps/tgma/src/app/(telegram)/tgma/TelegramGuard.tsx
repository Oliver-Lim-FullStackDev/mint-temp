'use client';

import React, { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function TelegramGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  useEffect(() => {
    const isTelegram =
      typeof window !== 'undefined' &&
      (document.referrer?.includes('t.me') ||
        document.referrer?.includes('telegram.org'));
    if (!isTelegram) {
      router.replace('/404');
    }
  }, [router]);

  return <>{children}</>;
}

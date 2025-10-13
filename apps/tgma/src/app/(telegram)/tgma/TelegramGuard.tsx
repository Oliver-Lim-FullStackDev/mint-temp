'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TelegramGuard({ children }: { children: React.ReactNode }) {
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

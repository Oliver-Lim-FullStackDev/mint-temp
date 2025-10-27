'use client';

import { useLayoutEffect } from 'react';
import { sessionStore } from 'src/modules/account/session-store';

export function SessionHydrator({ session }: { session: any }) {
  useLayoutEffect(() => {
    sessionStore.setState({ session });
  }, [session]);

  return null;
}

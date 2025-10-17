'use server';

import { cookies } from 'next/headers';

import type { CasinoSortOrder } from '@/modules/casino';
import { DEFAULT_FILTERS } from '@/modules/casino/state/utils';

import {
  CASINO_COOKIE_MAX_AGE,
  CASINO_ORDER_COOKIE,
  CASINO_PROVIDER_COOKIE,
} from './preferences';

export async function rememberCasinoProvider(provider: string) {
  const cookieStore = await cookies();

  if (provider) {
    cookieStore.set(CASINO_PROVIDER_COOKIE, provider, {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      maxAge: CASINO_COOKIE_MAX_AGE,
    });
  } else {
    cookieStore.delete(CASINO_PROVIDER_COOKIE);
  }
}

export async function rememberCasinoOrder(order: CasinoSortOrder) {
  const cookieStore = await cookies();

  if (order === DEFAULT_FILTERS.order) {
    cookieStore.delete(CASINO_ORDER_COOKIE);
    return;
  }

  cookieStore.set(CASINO_ORDER_COOKIE, order, {
    path: '/',
    httpOnly: false,
    sameSite: 'lax',
    maxAge: CASINO_COOKIE_MAX_AGE,
  });
}

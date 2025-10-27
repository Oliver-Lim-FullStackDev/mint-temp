'use server';

import { cookies } from 'next/headers';

import type { GamesSortOrder } from 'src/modules/games';
import { DEFAULT_FILTERS } from 'src/modules/games/state/utils';

import {
  GAMES_COOKIE_MAX_AGE,
  GAMES_ORDER_COOKIE,
  GAMES_PROVIDER_COOKIE,
} from './preferences';

export async function rememberGamesProvider(provider: string) {
  const cookieStore = await cookies();

  if (provider) {
    cookieStore.set(GAMES_PROVIDER_COOKIE, provider, {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      maxAge: GAMES_COOKIE_MAX_AGE,
    });
  } else {
    cookieStore.delete(GAMES_PROVIDER_COOKIE);
  }
}

export async function rememberGamesOrder(order: GamesSortOrder) {
  const cookieStore = await cookies();

  if (order === DEFAULT_FILTERS.order) {
    cookieStore.delete(GAMES_ORDER_COOKIE);
    return;
  }

  cookieStore.set(GAMES_ORDER_COOKIE, order, {
    path: '/',
    httpOnly: false,
    sameSite: 'lax',
    maxAge: GAMES_COOKIE_MAX_AGE,
  });
}

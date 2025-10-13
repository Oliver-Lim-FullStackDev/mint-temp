// apps/api/src/modules/auth/auth.types.ts

import { HG_Player, Player } from 'src/shared/hero-gaming.types';

/**
 * Represents the minimal user data structure
 *
 * @property id - Unique identifier for the user
 * @property wallet - The TON wallet address associated with this user
 */
export interface RawUser {
  id: string;
  wallet: string[];
}

/**
 * Represents the complete user data structure returned after authentication
 *
 * @property id - Unique identifier for the user
 * @property wallet - The TON wallet address associated with this user
 * @property username - Optional display name for the user
 * @property balance - Optional user's in-game currency balance
 * @property level - Optional user's game level
 * @property createdAt - Optional timestamp when the user account was created
 * @property sessionToken - Optional session token from Hero Gaming
 * @property playerData - Optional player data from Hero Gaming
 */
export interface HG_User {
  id: string | number;
  wallet?: string[];
  username?: string;
  balance?: number;
  level?: number;
  createdAt?: string;
  sessionToken?: string;
  playerData?: Partial<HG_Player>;
}

export interface User {
  id: string | number;
  wallet?: string[];
  username?: string;
  balance?: number;
  level?: number;
  createdAt?: string;
  token?: string;
  player?: Partial<Player>;
}

export interface TelegramUser {
  id: number;
  is_bot?: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

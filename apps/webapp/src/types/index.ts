import { Account } from "@tonconnect/ui-react";

export interface Item {
  id: string;
  title: string;
  description: string;
  price: {
    usd: number;
    stars: number;
  };
  imageUrl?: string;
  available: boolean;
}

export interface Purchase {
  userId: string;
  itemId: string;
  timestamp: number;
  transactionId: string;
}

export interface CurrentPurchaseWithSecret {
  item: Item;
  transactionId: string;
  timestamp: number;
  secret: string;
}

export type UserRole = "user";

export interface User {
  id: string;
  wallet: string;
  displayName?: string;
  username?: string;
  profileImageUrl?: string;
  balance?: number;
  level?: number;
  createdAt?: string;
  token?: string;
  player?: Player;
  role: UserRole;
}

export interface NonceResponse {
  nonce: string;
}

export interface PlayerAccount {
  id: number;
  currency: string;
  balanceCents: number;
  moneyBalanceCents: number;
  bonusBalanceCents: number;
  withdrawBalanceCents: number;
  eurBalanceCents: number;
  usdBalanceCents: number;
  main: boolean;
  selected: boolean;
  selected_currency: string;
  selected_currency_cents: number;
  enabled: boolean;
}

export interface Player {
  account: PlayerAccount;
  allAccounts: PlayerAccount[];
  username: string;
  profileImageUrl?: string;
  id: string;
  dealerId: string;
  email: string;
  language: string;
  createdAt: string;
  updatedAt: string;
  privateChannel: string;
  countryCode: string;
  sessionToken: string;
  displayName: string;
  mapsPlayerId: string;
  referralId: number;
  referralCount: number;
  // Add other player fields as needed
}

export interface TonProofPayload {
  wallet: Account;
  proof: {
    timestamp: number;
    domain: { lengthBytes: number; value: string };
    payload: string;
    signature: string;
  };
}

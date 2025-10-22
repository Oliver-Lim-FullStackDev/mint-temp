export interface NonceResponse {
  nonce: string;
}

export interface PlayerAccount {
  currency: string;
  balanceCents: number;
  moneyBalanceCents: number;
  bonusBalanceCents: number;
  withdrawBalanceCents: number;
  eurBalanceCents: number;
  usdBalanceCents: number;
  main: boolean;
  selected: boolean;
}

export interface Player {
  account: PlayerAccount;
  allAccounts: PlayerAccount[];
  username: string;
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

export interface PrivyVerificationPayload {
  referralId?: string;
  referrerId?: string;
}

export interface PrivyAuthToken {
  userId: string;
  appId: string;
  [key: string]: any; // Allow additional properties from Privy SDK
}

export interface PrivyLinkedAccount {
  type: 'wallet' | 'smart_wallet' | 'email' | 'phone' | 'google' | 'twitter' | 'discord' | 'github' | 'linkedin' | 'spotify' | 'instagram' | 'tiktok' | 'telegram';
  address?: string;
  chainType?: string;
  chainId?: string;
  walletClient?: string;
  walletClientType?: string;
  connectorType?: string;
  verifiedAt: string;
  firstVerifiedAt?: string;
  latestVerifiedAt?: string;
}

export interface PrivyUser {
  id: string;
  createdAt: Date | string;
  linkedAccounts: PrivyLinkedAccount[];
  google?: {
    subject: string;
    email: string;
    name: string;
  };
  telegram?: {
    telegramUserId: string;
    username: string;
    firstName?: string;
    lastName?: string;
    photoUrl?: string;
  };
  email?: {
    address: string;
  };
  [key: string]: any; // Allow additional properties from Privy SDK
}

export interface TonProofPayload {
      wallet: {
      address: string
      chain: string
      walletStateInit: string
      publicKey: string
    }
    proof: {
      timestamp: number
      domain: {
        lengthBytes: number
        value: string
      }
      payload: string
      signature: string
    }   // the original nonce you fetched
}
/**
 * NOTE: We don't want to map every Hero Gaming field there is, only what we need
 */
export interface Game {
  id: string;
  name: string;
  // Add any other fields as needed
}

export interface SearchResponse {
  items: Game[];
  total: number;
}

export interface TonWalletLoginInput {
  wallet_address: string;
  external_data: { username: string };
}

export interface PrivyLoginInput {
  userId: string;
  external_data: { username: string };
}

export interface RegisterResponse {
  username: string;
}

export interface PaymentAuthorizeRequest {
  amount_cents: string;
  currency: string;
  transaction_id: string;
  username: string;
  sub_provider: string;
  external_data?: Record<string, any>;
}

export interface PaymentAuthorizeResponse {
  status: string;
  auth_code: string;
}

export interface PaymentTransferRequest {
  username: string;
  currency: string;
  transaction_id: string;
  sub_provider?: string; // Optional for backward compatibility
  status: string;
  auth_code: string;
}

export interface PaymentTransferResponse {
  status: string;
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

export interface HG_Player {
  account: PlayerAccount;
  all_accounts: PlayerAccount[];
  address: any;
  avatar: any;
  username: string;
  id: string;
  dealerId: string;
  birthdate: any;
  email: any;
  language: string;
  createdAt: string;
  updatedAt: string;
  pp: number;
  privateChannel: string;
  netEntSessionId: any;
  countryCode: string;
  sessionToken: string;
  rubies: number;
  affiliateId: any;
  affiliateTag: any;
  affiliateClickId: any;
  affiliateSubId: any;
  ballsPendingCents: number;
  ballsCents: number;
  brainsPendingCents: number;
  brainsCents: number;
  inventoryNotifications: number;
  vip: any;
  vipProgram: any;
  deposited: boolean;
  avatarImageUrl: any;
  requiresPhoneValidation: string;
  requiresEmailValidation: string;
  allowSMS: boolean;
  allowEmail: boolean;
  tcAccepted: boolean;
  personId: any;
  displayName: string;
  sourceOfFunds: any;
  requireSourceOfWealth: any;
  sourceOfWealth: any;
  withdrawalsDisallowed: boolean;
  segments: {
    valueSegment: any;
    productSegment: any;
  };
  vipTier: string;
  pan_identifier: any;
  mapsPlayerId: string;
  cdd_status: any;
  registration_method: string;
  registration_promo_code: any;
  abUserId: any;
  internalId: number;
  claimableBalanceCents: number;
  mainBetbackBalanceCents: number;
  nextBetbackBalanceCents: number;
  betbackProgressPercentage: number;
  betbackProgress: number;
  betbackDropPoint: number;
  referral_id: number;
  referral_count: number;
}
export interface Player {
  account: PlayerAccount;
  balances: {
    [key: string]: PlayerAccount;
  };
  address: any;
  avatar: any;
  username: string;
  id: number;
  dealerId: string;
  birthdate: any;
  email: any;
  language: string;
  createdAt: string;
  updatedAt: string;
  pp: number;
  privateChannel: string;
  netEntSessionId: any;
  countryCode: string;
  sessionToken: string;
  rubies: number;
  affiliateId: any;
  affiliateTag: any;
  affiliateClickId: any;
  affiliateSubId: any;
  ballsPendingCents: number;
  ballsCents: number;
  brainsPendingCents: number;
  brainsCents: number;
  inventoryNotifications: number;
  vip: any;
  vipProgram: any;
  deposited: boolean;
  profileImageUrl: string;
  requiresPhoneValidation: string;
  requiresEmailValidation: string;
  allowSMS: boolean;
  allowEmail: boolean;
  tcAccepted: boolean;
  personId: any;
  displayName: string;
  sourceOfFunds: any;
  requireSourceOfWealth: any;
  sourceOfWealth: any;
  withdrawalsDisallowed: boolean;
  segments: {
    valueSegment: any;
    productSegment: any;
  };
  vipTier: string;
  panIdentifier: any;
  mapsPlayerId: string;
  cddStatus: any;
  registrationMethod: string;
  registrationPromo_code: any;
  abUserId: any;
  internalId: number;
  claimableBalanceCents: number;
  mainBetbackBalanceCents: number;
  nextBetbackBalanceCents: number;
  betbackProgressPercentage: number;
  betbackProgress: number;
  betbackDropPoint: number;
  referralId: number;
  referralCount: number;
  // Add other player fields as needed
}

export interface WalletAddress {
  id?: string;
  wallet_address: string | null;
  external_data: {
    username?: string;
    nonce?: string;
    session_token?: string;
    playerId?: string;
    purchaseCount?: number;
    totalSpent?: number;
    lastPurchase?: {
      itemId: string;
      amount: number;
      transactionId: string;
      timestamp: string;
    };
    firstPurchase?: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface WalletAddressRequest {
  wallet_address: WalletAddress;
}

export interface SessionResponse {
  player: Partial<Player>;
  token: string;
  prefixedToken: string;
  loggedInAt: number;
  quickGames: any[];
}

export interface HG_SessionResponse {
  player: HG_Player;
  token: string;
  prefixedToken: string;
  loggedInAt: number;
  quickGames: Array<any>;
}

export interface HeroAccount {
  currency: string;
  balanceCents: number;
}

export interface HeroPlayer {
  internalId: number;
  dealerId?: string;
  mapsPlayerId?: string;
  username?: string;
  displayName?: string;
  createdAt: string;
  all_accounts?: HeroAccount[];
}

export interface HeroPlayersResponse {
  result: HeroPlayer[];
  meta: {
    page: number;
    per_page: number;
    count: number;
    total_count: number;
  };
  errors?: string[][];
}

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
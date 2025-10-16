// apps/tgma/src/lib/authClient.ts
import { NonceResponse, TonProofPayload, User } from '@/types';
import { mintApi } from '@mint/client';
import { Account, TonProofItemReplySuccess } from '@tonconnect/ui-react';

/**
 * Step 1: fetch a fresh nonce for this wallet
 */
export async function fetchNonce(wallet: string): Promise<string> {
  const response = await mintApi.get<NonceResponse | null>(`/auth/nonce/${wallet}`);
  if (!response || typeof response.nonce !== 'string') {
    throw new Error('Nonce not found in response');
  }
  return response.nonce;
}

/**
 * Step 2: Register with TON proof
 * @param proof - The proof object from the wallet
 * @param walletAddress - The wallet address (should be passed from the component)
 * @param nonce - The nonce that was used for the proof (should be passed from the component)
 * @param referralId - Optional referralId
 * @param referrer - Optional referrer partner code
 */
export const registerTonProof = async (
  proof: TonProofItemReplySuccess['proof'],
  walletAccount: Account,
  referralId?: string | null,
  referrer?: string | null,
): Promise<User> => {
  console.log('Raw proof from wallet:', proof);

  // Format the payload for the backend
  const payload: TonProofPayload = {
    wallet: walletAccount,
    proof: {
      timestamp: proof.timestamp,
      domain: proof.domain,
      payload: proof.payload,
      signature: proof.signature
    },
  };

  return submitTonProof(payload, referralId, referrer);
}

/**
 * Step 3: submit the TON proof to register (or throw 401)
 */
export async function submitTonProof(
  tonProof: TonProofPayload,
  referralId?: string | null,
  referrer?: string | null,
): Promise<User> {
  try {
    if (process.env.NODE_ENV !== 'production') {
      console.log('Submitting proof to backend:', { tonProof });
    }

    // our NestJS expects { tonProof: { wallet, proof, nonce } }
    const user = await mintApi.post<User | null>(
      '/auth/register',
      {
        tonProof,
        referralId,
        referrer,
      }
    );
    if (!user) throw new Error('No user returned from backend');

    return user;
  } catch (error) {
    console.error('Error submitting proof to backend:', error);
    throw error;
  }
}


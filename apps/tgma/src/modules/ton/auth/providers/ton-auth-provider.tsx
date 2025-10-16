'use client';

import { useEffect, useState, ReactNode } from 'react';
import { Account, TonProofItemReplySuccess, useTonAddress, useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';
import { useUserAuth } from '@/modules/ton/auth/context/user-auth-ton-provider';
import { fetchNonce, registerTonProof } from '@/modules/ton/auth/lib/auth-client';

interface AuthGuardProps {
  children: ReactNode;
}


/**
 * Auth Provider for TON wallet authentication
 * Handles the complete authentication flow:
 * 1. Fetching nonce when wallet is connected
 * 2. Setting up TON proof parameters
 * 3. Listening for proof signing
 * 4. Registering the proof with the backend
 */

export function TonAuthProvider({ children }: AuthGuardProps) {
  const address = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();
  const proofItem = wallet?.connectItems?.tonProof as TonProofItemReplySuccess;

  // Use the global user auth context
  const { setUser, clearUser, setLoading, setError } = useUserAuth();
  const [currentNonce, setCurrentNonce] = useState<string | null>(null);

  /**
   * Send a request to the wallet to sign a proof with the latest nonce,
   * and store the nonce in state for later use.
   *
   * @returns The nonce that was used for the proof, or null on error.
   */
  const sendProofCheck = async () => {
    try {
      const nonce = await fetchNonce(address);
      // Store the nonce in state for later use
      setCurrentNonce(nonce);

      // Set the payload with the nonce for signing
      tonConnectUI.setConnectRequestParameters({
        state: "ready",
        value: { tonProof: nonce },
      });
      setError(null);
      return nonce;
    } catch (e) {
      console.error("Failed to fetch nonce:", e);
      // setError(`Failed to fetch nonce, Please sign-in again`);
    }
  };

  /**
   * Register the TON proof with the backend, setting the user context and displaying errors.
   * This function is called after the user has signed the proof.
   *
   * @param proofItem - The proof item from the wallet after signing, containing the proof payload and signature.
   * @param currentNonce - The nonce that was used for the proof, stored in state.
   */
  const registerProof = async (
    proofItem: TonProofItemReplySuccess,
    walletAccount: Account
  ) => {
    setLoading(true); // Set loading state to true before registering proof
    try {
      const referralId = localStorage.getItem('mint-user-referral-id') || undefined;
      const referrer = localStorage.getItem('mint-user-referrer-id') || undefined;
      const userData = await registerTonProof(proofItem.proof, walletAccount , referralId, referrer);
      // Remove ref from localStorage after usage
      localStorage.removeItem('mint-user-referral-id');
      localStorage.removeItem('mint-user-referrer-id');
      setUser(userData);
    } catch (err) {
      console.error("Failed to register TON proof:", err);
      // setError("Failed to register TON proof");
    } finally {
      setLoading(false); // Set loading state to false after completion or on error
    }
  };

  // 1) Whenever we have a wallet address, fetch the nonce and
  useEffect(() => {
    if (!tonConnectUI) return;
    if ((address != undefined && address !== null && address.length > 0)) sendProofCheck();
  }, [address, tonConnectUI]);

  // 2) Whenever we have a proof item and a nonce, register the proof
  useEffect(() => {
    if (!wallet?.account?.publicKey) return;
    if (proofItem && currentNonce && wallet?.account?.publicKey) {
      registerProof(proofItem, wallet?.account as Account);
    }
  }, [proofItem, currentNonce, wallet?.account?.publicKey]);

  // 3) Listen for wallet disconnection
  useEffect(() => {
    if (!tonConnectUI) return;
    // Set up a listener for wallet status changes
    const unsubscribe = tonConnectUI.onStatusChange((walletInfo) => {
      if (!walletInfo) {
        console.log("Wallet disconnected, clearing user data");
        clearUser(); // Call clearUser from useUserAuth to clean up user state
      }
    });
    // Clean up the listener when the component unmounts
    return () => {
      unsubscribe();
    };
  }, [tonConnectUI, clearUser]);

  return <>{children}</>;
}

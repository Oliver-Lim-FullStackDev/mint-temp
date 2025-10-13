"use client";

import {
  useTonAddress,
  useTonConnectUI,
  useTonWallet
} from "@tonconnect/ui-react";
import { useUserAuth } from "../context/user-auth-ton-provider";

export function useTonAuth() {
  const address = useTonAddress();
  const wallet = useTonWallet();
  const { isAuthenticated } = useUserAuth();



  return {
    wallet,
    address,
    isWallet: !!wallet,
    isAuthenticated: !!isAuthenticated,
    hasProof: !!wallet?.connectItems?.tonProof,
  };
}

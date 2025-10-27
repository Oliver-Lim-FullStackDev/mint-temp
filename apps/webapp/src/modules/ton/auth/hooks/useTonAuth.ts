"use client";

import {
  useTonAddress,
  useTonWallet
} from "@tonconnect/ui-react";
import { useUserAuth } from "src/modules/privy/auth/context/user-auth-privy-provider";

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

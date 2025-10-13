"use client";

import { useState } from "react";
import type { WebApp } from "@twa-dev/types";

export type IWebAppUser = WebApp['initDataUnsafe']['user']

interface UseTelegramAuthReturn {
  loading: boolean;
  setLoading: (isLoading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  TelegramUser: IWebAppUser | null;
  setTelegramUser: (user: IWebAppUser | null) => void;
}

export function useTelegramAuth(): UseTelegramAuthReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [TelegramUser, setTelegramUser] = useState<IWebAppUser | null>(null)



  return { loading, setLoading, error, setError, TelegramUser, setTelegramUser };
}

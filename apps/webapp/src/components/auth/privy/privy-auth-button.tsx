'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePrivy, User } from '@privy-io/react-auth';
import { Text } from "@mint/ui/components";
import { Button, Stack } from '@mint/ui/components/core';
import { verifyPrivyAuth } from './verify-auth';

type PrivyAuthButtonProps = {
  /** Optional label for the button */
  label?: string;
  /** Optional callback invoked after successful server verification */
  onVerified?: (result: User) => void;
  /** Disabled state override */
  disabled?: boolean;
};

/**
 * PrivyAuthButton
 * - Triggers Privy login flow on click.
 * - Optionally performs server verification using a backend route that validates
 *   the Privy access token with `PRIVY_APP_SECRET`.
 *
 * Notes:
 * - Ensure `PrivyProvider` is added at the app root with `NEXT_PUBLIC_PRIVY_APP_ID`.
 * - When `serverVeririfcation` is true, this component will POST to
 *   `/api/auth/privy/verify`
 */
export function PrivyAuthButton({
  label = 'Login with Privy',
  onVerified,
  disabled,
}: PrivyAuthButtonProps) {
  const { login, ready, authenticated, user, logout } = usePrivy();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const appId = useMemo(() => process.env.NEXT_PUBLIC_PRIVY_APP_ID, []);

  const handleClick = useCallback(async () => {
    setError(null);
    setLoading(true);
    if (authenticated) {
      await logout();
      setLoading(false);
      return;
    }

    try {
      if (!ready) throw new Error('Privy is not ready. Ensure PrivyProvider is configured.');
      if (!appId) console.warn('NEXT_PUBLIC_PRIVY_APP_ID is not set.');

      await login();
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      setError(message);
      console.error('[PrivyAuthButton] Error:', e);
    } finally {
      setLoading(false);
    }
  }, [appId, ready, authenticated, login, logout]);


  // Alert only once per page lifecycle or on first login
  // Uses a window-scoped flag that resets on full page refresh
  useEffect(() => {
    if (!authenticated) return;
    const flagKey = '__privyAlerted__';
    const alerted = typeof window !== 'undefined' && (window as any)[flagKey];
    if (!alerted) {
      verifyPrivyAuth().then((user) => {
        // TODO: set the user Object after Finishing Hero gaming Auth implmentation
        onVerified?.(user);
      })

      if (typeof window !== 'undefined') {
        (window as any)[flagKey] = true;
      }
    }
  }, [authenticated])


  const buttonText = useMemo(() => {
    if (loading) return `Signing ${authenticated ? 'out' : 'in'}…`;
    if (authenticated) return 'Disconnect';
    return label;
  }, [authenticated, label, loading]);

  return (
    <>
      <Stack display="contents" alignItems="center" justifyContent="center" justifyItems={"center"} >
        {authenticated && <Text> {user?.google?.name ? null : "Wallet ID: "} <b>{user?.google?.name || user?.wallet?.id}</b> </Text>}
        <Button
          color="primary"
          variant="contained"
          onClick={handleClick}
          disabled={disabled || loading || !ready}
          sx={{
            textTransform: 'none',
            fontWeight: 700,
            borderRadius: 2,
            px: 2.5,
            py: 0.25,
          }}
        >
          {buttonText}
        </Button>
      </Stack>
      {error ? (
        <Text>
          Error: {error}
        </Text>
      ) : null}
    </>
  );
}

export default PrivyAuthButton;

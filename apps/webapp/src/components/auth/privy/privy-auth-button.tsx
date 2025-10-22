'use client';

import { useUserAuth } from '@/modules/privy/auth/context/user-auth-privy-provider';
import { PRIVY_FLAG_KEY } from '@/modules/privy/auth/providers/privy-auth-provider';
import { Button, Stack } from '@mint/ui';
import { Text } from '@mint/ui/components';
import { usePrivy } from '@privy-io/react-auth';
import { useCallback, useMemo, useState } from 'react';

type PrivyAuthButtonProps = {
  /** Optional label for the button */
  label?: string;
  /** Optional callback invoked after successful login */
  onLogin?: () => void;
  /** Disabled state override */
  disabled?: boolean;
};

/**
 * PrivyAuthButton
 * - Triggers Privy login flow on click using SDK hooks directly
 * - Shows user info when authenticated
 * - Handles logout functionality
 *
 * Notes:
 * - Ensure `PrivyProvider` is added at the app root with `NEXT_PUBLIC_PRIVY_APP_ID`
 * - Authentication verification is handled by `PrivyAuthProvider`
 */
export function PrivyAuthButton({
  label = 'Login with Privy',
  onLogin,
  disabled,
}: PrivyAuthButtonProps) {
  const { login, ready, authenticated, logout } = usePrivy();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, clearUser } = useUserAuth();

  const appId = useMemo(() => process.env.NEXT_PUBLIC_PRIVY_APP_ID, []);

  const handleClick = useCallback(async () => {
    setError(null);
    setLoading(true);
    
    if (authenticated) {
      await logout();
      clearUser();
      setLoading(false);
      if (typeof window !== 'undefined') (window as any)[PRIVY_FLAG_KEY] = false;
      return;
    }

    try {
      if (!ready) throw new Error('Privy is not ready. Ensure PrivyProvider is configured.');
      if (!appId) console.warn('NEXT_PUBLIC_PRIVY_APP_ID is not set.');

      await login();
      onLogin?.();
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      setError(message);
      console.error('[PrivyAuthButton] Error:', e);
    } finally {
      setLoading(false);
    }
  }, [appId, ready, authenticated, login, logout, onLogin]);

  const buttonText = useMemo(() => {
    if (loading) return `Signing ${authenticated ? 'out' : 'in'}…`;
    if (authenticated) return 'Disconnect';
    return label;
  }, [authenticated, label, loading]);

  return (
    <>
      <Stack display="contents" alignItems="center" justifyContent="center" justifyItems={"center"} >
        {authenticated && user && (
          <Text>
            <b>{user?.username}</b>
          </Text>
        )}
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

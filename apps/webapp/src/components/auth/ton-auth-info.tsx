'use client';

import { useUserAuth } from 'src/modules/privy/auth/context/user-auth-privy-provider';
import { useTonAuth } from 'src/modules/ton/auth/hooks/useTonAuth';
import { Box, Typography } from '@mint/ui/components/core';
import { TonConnectButton } from '@tonconnect/ui-react';


/**
 * Displays TonConnect button and authentication status.
 * If user is authenticated, displays their username.
 * If there is an error, displays the error message.
 * If authentication is in progress, displays loading message.
 */
export function TonAuthInfo() {
  const { user, error, loading, isAuthenticated } = useUserAuth();
  const { address } = useTonAuth()


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 10 }}>
      {!isAuthenticated  && error && (
        <Typography variant="body2" color="error">
          {error}
        </Typography>
      )}

     <TonConnectButton />

      {loading ? (
        <Typography variant="body2" color="text.secondary">
          Loading authentication data...
        </Typography>
      ) : !address ? null : <Typography variant="body1" color="text.secondary">
        {user?.displayName
          ? <span>Signed in as: <strong>{user.displayName}</strong></span>
          : 'User not verified, please sign again'}
      </Typography>}

    </Box>
  );
}

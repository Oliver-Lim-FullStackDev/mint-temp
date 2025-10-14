'use client';

import { useUserAuth } from '@/modules/ton/auth/context/user-auth-ton-provider';
import { useTonAuth } from '@/modules/ton/auth/hooks/useTonAuth';
import { Box, Typography } from '@mint/ui';
import { TonConnectButton } from '@tonconnect/ui-react';


/**
 * Displays TonConnect button and authentication status.
 * If user is authenticated, displays their username.
 * If there is an error, displays the error message.
 * If authentication is in progress, displays loading message.
 */
export function TonAuthInfo() {
  const { user, error, loading, webAppUser, isAuthenticated } = useUserAuth();
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

      {!!webAppUser?.initData?.length &&
        <div style={{maxWidth: '700px', overflow: 'scroll'}}>
          <h1>initData</h1><br/>
          {JSON.stringify(webAppUser?.initData)}<br/>
            <h1>initDataUnsafe</h1>
          {JSON.stringify(webAppUser?.initDataUnsafe)}<br/>
        </div>}

    </Box>
  );
}

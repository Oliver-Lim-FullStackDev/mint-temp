'use client';

import { Box, Typography, Button, Paper, Alert } from '@mint/ui/components/core';
import { Iconify } from '@mint/ui/components/iconify';

interface ConnectWalletButtonProps {
  onConnect: () => void;
}

export default function ConnectWalletButton({ onConnect }: ConnectWalletButtonProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
        p: 3,
        textAlign: 'center',
        bgcolor: 'background.default'
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 4,
          maxWidth: 400,
          width: '100%',
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Iconify
            icon="logos:telegram"
            width={64}
            height={64}
            sx={{ color: 'info.main' }}
          />
        </Box>

        <Typography variant="h4" component="h1" sx={{ mb: 2, fontWeight: 600 }}>
          Welcome to Mint Store
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          You&apos;re in Telegram! You can pay with Telegram Stars or connect your TON wallet.
        </Typography>

        <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
          <Typography variant="body2">
            You can use Telegram Stars for instant payments or connect your TON wallet for cryptocurrency payments.
          </Typography>
        </Alert>

        <Button
          variant="contained"
          size="large"
          onClick={onConnect}
          startIcon={<Iconify icon="logos:telegram" />}
          sx={{
            width: '100%',
            py: 1.5,
            mb: 2
          }}
        >
          Start Shopping
        </Button>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
          Don&apos;t have a TON wallet? Download one from{' '}
          <a
            href="https://ton.org/wallets"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'inherit', textDecoration: 'underline' }}
          >
            ton.org
          </a>
        </Typography>
      </Paper>
    </Box>
  );
}

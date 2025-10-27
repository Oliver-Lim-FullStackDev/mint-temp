'use client';

import { useState, useRef } from 'react';
import { Box, Stack, Typography, IconButton, Portal, ClickAwayListener } from '@mint/ui/components/core';
import { Iconify } from '@mint/ui/components/iconify';
import { useSession } from 'src/modules/account/session-store';
import { useShowFiatValues } from 'src/modules/wallet/wallet-store';
import { useSessionPolling } from 'src/hooks/useSessionPolling';
import { useCurrencies } from 'src/hooks/useCurrencies';
import { WalletDialog } from 'src/modules/wallet';
import { getCurrencyIconKey, CurrencyType } from 'src/utils/currency';

export function HeaderWallet() {
  const { session } = useSession();
  const showFiatValues = useShowFiatValues();
  const [walletDialogOpen, setWalletDialogOpen] = useState(false);
  const walletButtonRef = useRef<HTMLDivElement>(null);
  const { currencies } = useCurrencies();

  // Automatically refetch session every 5 seconds when showing fiat values
  useSessionPolling();

  const player = session?.player;
  const balances = player?.balances || {};
  const allAccounts = Object.values(balances) as any[];

  // Get the selected crypto account (the one with selected: true)
  const selectedCryptoAccount = allAccounts.find(acc => acc.selected === true);

  // Get selected fiat currency from player.account
  const selectedFiatCurrency = player?.account?.selected_currency || 'USD';

  // Determine which currency to display based on showFiatValues setting
  let displayCurrency: string;
  let displayBalanceCents: number;
  let displayIcon: string;

  if (showFiatValues) {
    // Show fiat currency
    displayCurrency = selectedFiatCurrency;
    // Sum all accounts' balances in the selected fiat currency
    displayBalanceCents = allAccounts.reduce((sum, account) => {
      return sum + (account.selected_currency_cents || 0);
    }, 0);
    displayIcon = getCurrencyIconKey(selectedFiatCurrency, 'fiat');
  } else {
    // Show selected crypto
    displayCurrency = selectedCryptoAccount?.currency || 'BTC';
    displayBalanceCents = selectedCryptoAccount?.balanceCents || 0;
    displayIcon = getCurrencyIconKey(displayCurrency, 'crypto');
  }

  // Format balance
  const formatBalance = (cents: number, currency: string) => {
    const amount = cents / 100;

    // Check if it's a fiat currency using the currencies data
    const currencyInfo = currencies?.find(c => c.code === currency.toUpperCase());
    const isFiat = currencyInfo?.type === 'fiat';

    if (isFiat) {
      // Use currency formatting for fiat
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(amount);
    } else {
      // For crypto, just format as number with currency symbol
      const formatted = amount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 8,
      });
      return `${formatted} ${currency}`;
    }
  };

  const balanceLabel = formatBalance(displayBalanceCents, displayCurrency);

  const handleWalletClick = () => {
    setWalletDialogOpen(true);
  };

  const handleWalletClose = () => {
    setWalletDialogOpen(false);
  };

  const handleClickAway = () => {
    setWalletDialogOpen(false);
  };

  // Get button position for dropdown positioning
  const getDropdownPosition = () => {
    if (!walletButtonRef.current) return { top: 0, right: 0 };

    const rect = walletButtonRef.current.getBoundingClientRect();
    return {
      top: rect.bottom + 8, // 8px gap below button
      right: window.innerWidth - rect.right, // Align right edge with button
    };
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box sx={{ position: 'relative' }}>
        <Box
          ref={walletButtonRef}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            padding: '4px 8px',
            borderRadius: (theme) => Number(theme.shape.borderRadius) * 2,
            backgroundColor: 'rgba(0, 241, 203, 0.14)',
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Iconify icon={displayIcon} width={28} height={28} />
            </Box>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, fontSize: 15, color: '#fff', lineHeight: 1 }}
            >
              {balanceLabel}
            </Typography>
          </Stack>

          <IconButton
            onClick={handleWalletClick}
            size="small"
            sx={{
              width: 32,
              height: 32,
              borderRadius: (theme) => Number(theme.shape.borderRadius) * 1.5,
              backgroundColor: '#00F1CB',
              boxShadow: '0px 0px 10px rgba(0, 241, 203, 0.45)',
              '&:hover': {
                backgroundColor: '#33F6DA',
              },
            }}
          >
            <Iconify icon="mint:header-plus" width={14} height={14} sx={{ color: '#000' }} />
          </IconButton>
        </Box>

        {walletDialogOpen && (
          <Portal>
            <Box
              sx={{
                position: 'fixed',
                zIndex: 'var(--layout-modal-zIndex, 10003)',
                ...getDropdownPosition(),
              }}
            >
              <WalletDialog
                open={walletDialogOpen}
                onClose={handleWalletClose}
                asDropdown
              />
            </Box>
          </Portal>
        )}
      </Box>
    </ClickAwayListener>
  );
}

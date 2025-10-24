'use client';

import { useMemo, useState } from 'react';
import { Box, Stack, FormControlLabel } from '@mint/ui/components/core';
import { Iconify } from '@mint/ui/components/iconify';
import { CurrencyItem, Text, MintSwitch } from '@mint/ui/components';
import { useCurrencies, CurrencyType } from '@/hooks/useCurrencies';
import { useSession } from '@/modules/account/session-store';
import { useWalletSettings, useSetShowFiatValues, useSetHideZeroBalances } from '@/modules/wallet/wallet-store';
import { useUpdateAccount } from '@/hooks/useUpdateAccount';

export function WalletSettingsList() {
  const { session } = useSession();
  const { currencies, isLoading: isCurrenciesLoading } = useCurrencies();
  const { showFiatValues, hideZeroBalances } = useWalletSettings();
  const setShowFiatValues = useSetShowFiatValues();
  const setHideZeroBalances = useSetHideZeroBalances();
  const { updateAccountAsync } = useUpdateAccount();
  const [updatingCurrency, setUpdatingCurrency] = useState<string | null>(null);

  const player = session?.player;
  const balances = player?.balances || {};
  const allAccounts = Object.values(balances) as any[];

  // Get account for a currency
  const getAccount = (currency: string) => {
    return allAccounts.find(acc => acc.currency === currency);
  };

  // Get account balance for a currency
  const getAccountBalance = (currency: string) => {
    const account = getAccount(currency);
    return account?.balanceCents || 0;
  };

  // Check if currency is enabled in account
  const isCurrencyEnabled = (currency: string) => {
    const account = getAccount(currency);
    return account?.enabled && account.enabled !== false;
  };

  // Filter currencies based on settings
  const filteredCurrencies = useMemo(() => {
    let filtered = currencies;

    // Always show only crypto currencies in the settings list
    // Fiat currencies are only for display purposes and shouldn't be toggled
    filtered = filtered.filter(currency => currency.type === CurrencyType.CRYPTO);

    // Filter by balance based on hideZeroBalances setting
    if (hideZeroBalances) {
      filtered = filtered.filter(currency => {
        const balance = getAccountBalance(currency.code);
        return balance > 0;
      });
    }

    // Sort with enabled currencies first, then selected currency first within each group
    filtered = filtered.sort((a, b) => {
      const aAccount = getAccount(a.code);
      const bAccount = getAccount(b.code);

      const aEnabled = aAccount?.enabled && aAccount.enabled !== false;
      const bEnabled = bAccount?.enabled && bAccount.enabled !== false;

      // First priority: enabled currencies come before disabled ones
      if (aEnabled && !bEnabled) return -1;
      if (!aEnabled && bEnabled) return 1;

      // Second priority: within same enabled status, selected comes first
      if (aAccount?.selected && !bAccount?.selected) return -1;
      if (!aAccount?.selected && bAccount?.selected) return 1;

      // If both have same enabled status and selected status, maintain original order
      return 0;
    });

    return filtered;
  }, [showFiatValues, hideZeroBalances, currencies, allAccounts]);

  const handleCurrencyToggle = async (currency: string) => {
    const account = getAccount(currency);
    if (!account || !account.id) {
      console.error('Account ID not found for currency:', currency);
      return;
    }

    const token = session?.token;
    if (!token) {
      console.error('No session token available');
      return;
    }

    const currentEnabled = isCurrencyEnabled(currency);
    const newEnabled = !currentEnabled;

    // Set loading state for this specific currency
    setUpdatingCurrency(currency);

    try {
      await updateAccountAsync({
        accountId: account.id,
        enabled: newEnabled,
        token,
        currency, // Pass currency for session update
      });
    } catch (error) {
      console.error('Failed to update currency:', error);
    } finally {
      // Clear loading state
      setUpdatingCurrency(null);
    }
  };

  const isCurrencyDisabled = (currency: string) => {
    const balance = getAccountBalance(currency);
    return balance > 0; // Can't disable currencies with balance
  };

  return (
    <Stack spacing={3}>
      {/* Currency List */}
      <Stack spacing={1}>
        {filteredCurrencies.map((currency) => {
          const balance = getAccountBalance(currency.code);
          const isDisabled = isCurrencyDisabled(currency.code);
          const isEnabled = isCurrencyEnabled(currency.code);
          const isUpdating = updatingCurrency === currency.code;

          return (
            <CurrencyItem
              key={`${currency.type}-${currency.code}`}
              icon={<Iconify icon={currency.icon} width={24} height={24} />}
              title={currency.name}
              subtitle={currency.code}
              sx={{
                border: 'none',
                background: 'transparent',
              }}
              rightContent={
                <>
                  {isDisabled && (
                    <Text
                      variant="caption"
                      sx={{
                        color: 'rgba(255, 255, 255, 0.5)',
                        fontSize: '12px',
                        fontStyle: 'italic',
                      }}
                    >
                      Can't hide with balance
                    </Text>
                  )}
                  <MintSwitch
                    checked={isEnabled}
                    onChange={() => handleCurrencyToggle(currency.code)}
                    disabled={isDisabled || isUpdating}
                  />
                </>
              }
            />
          );
        })}
      </Stack>

      {/* Global Settings - Bottom Row */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
        }}
      >
        {/* Show Fiat Values - Left */}
        <FormControlLabel
          control={
            <MintSwitch
              checked={showFiatValues}
              onChange={(e) => setShowFiatValues(e.target.checked)}
            />
          }
          label={
            <Text
              variant="body1"
              sx={{
                color: '#fff',
                fontWeight: 500,
              }}
            >
              Show Fiat Values
            </Text>
          }
        />

        {/* Hide Zero Balances - Right */}
        <FormControlLabel
          control={
            <MintSwitch
              checked={hideZeroBalances}
              onChange={(e) => setHideZeroBalances(e.target.checked)}
            />
          }
          label={
            <Text
              variant="body1"
              sx={{
                color: '#fff',
                fontWeight: 500,
              }}
            >
              Hide Zero Balances
            </Text>
          }
        />
      </Box>
    </Stack>
  );
}

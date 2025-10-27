'use client';

import { useState, useEffect } from 'react';
import { Box, Stack } from '@mint/ui/components/core';
import { GlassDialog, WalletButton, CircleIconButton, WalletTabs, Text } from '@mint/ui/components';
import { Iconify } from '@mint/ui/components/iconify';
import { getServerSession } from '@mint/client';
import { useCurrencies } from 'src/hooks/useCurrencies';
import { useSelectAccount } from 'src/modules/session/hooks';
import { useSessionPolling } from 'src/hooks/useSessionPolling';
import { CurrencyType } from 'src/utils/currency';
import { useSession, useSetSession } from 'src/modules/account/session-store';
import { WalletSettingsList } from 'src/modules/wallet/components/wallet-settings-list';
import { CurrencySelector } from 'src/modules/wallet/components/currency-selector';
import { WalletCurrencyItem } from 'src/modules/wallet/components/wallet-currency-item';

interface WalletDialogProps {
  open: boolean;
  onClose: () => void;
  asDropdown?: boolean;
}

const SETTINGS_TABS = [
  {
    value: 0,
    label: 'Wallets',
    icon: <Iconify icon="mint:header-wallet" width={20} height={20} />,
  },
  {
    value: 1,
    label: 'Currency',
    icon: <Iconify icon="mint:search" width={20} height={20} />,
  },
];

export function WalletDialog({ open, onClose, asDropdown = false }: WalletDialogProps) {
  const { session } = useSession();
  const setSession = useSetSession();
  const { currencies, refetch: refetchCurrencies } = useCurrencies();
  const { selectAccount, isLoading: isSelectingAccount } = useSelectAccount();
  const [showSettings, setShowSettings] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState(0);

  // Automatically refetch session every 5 seconds when showing fiat values
  useSessionPolling();

  // Refetch session and currencies when dialog opens
  useEffect(() => {
    if (open) {
      const refetchSession = async () => {
        const freshSession = await getServerSession();
        if (freshSession) {
          setSession(freshSession);
        }
      };

      refetchSession();
      refetchCurrencies();
    }
  }, [open, setSession, refetchCurrencies]);

  const player = session?.player;
  const balances = player?.balances || {};
  const selectedCurrency = player?.account?.selected_currency || 'USD';

  // Convert balances object to array for easier iteration
  const allAccounts = Object.values(balances) as any[];

  // Filter accounts to only show enabled ones and sort with selected currency first
  const enabledAccounts = allAccounts
    .filter((account) => account?.enabled && account.enabled !== false)
    .sort((a, b) => {
      // If one is selected and the other isn't, selected comes first
      if (a.selected && !b.selected) return -1;
      if (!a.selected && b.selected) return 1;

      // If both are selected or both are not selected, maintain original order
      return 0;
    });

  // Format balance based on selected currency
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
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    } else {
      // For crypto, just format as number with currency symbol
      return `${amount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 8,
      })} ${currency}`;
    }
  };

  const getTotalEstimatedBalance = () => {
    // Sum all enabled accounts' balances converted to the selected currency
    const total = enabledAccounts.reduce((sum, account) => {
      return sum + (account.selected_currency_cents || 0);
    }, 0);
    return formatBalance(total, selectedCurrency);
  };

  const handleSettingsClick = () => {
    setShowSettings(true);
  };

  const handleSettingsClose = () => {
    setShowSettings(false);
    setActiveSettingsTab(0);
  };

  const handleSettingsBack = () => {
    setShowSettings(false);
    setActiveSettingsTab(0);
  };

  const handleCashierClick = () => {
    // TODO: Implement cashier functionality
    console.log('Cashier clicked');
  };

  const handleSelectAccount = (currency: string) => {
    const token = session?.token;
    if (!token) {
      console.error('No session token available');
      return;
    }

    selectAccount({ currency, token });
  };

  // Render dialog content
  const renderDialogContent = () => {
    if (showSettings) {
      return (
        <>
          {/* Header with back button and close button */}
          <Box
            sx={{
              position: 'relative',
              p: 3,
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            {/* Back button */}
            <CircleIconButton
              onClick={handleSettingsBack}
              icon={<Iconify icon="mint:left-arrow" width={16} height={16} />}
              sx={{
                position: 'absolute',
                left: 16,
                top: '50%',
                transform: 'translateY(-50%)',
              }}
            />

            {/* Title */}
            <Text
              variant="h4"
              sx={{
                color: '#fff',
                textAlign: 'center',
              }}
            >
              Settings
            </Text>

            {/* Close button */}
            <CircleIconButton
              onClick={onClose}
              icon={<Iconify icon="mint:cross" width={16} height={16} />}
              sx={{
                position: 'absolute',
                right: 16,
                top: '50%',
                transform: 'translateY(-50%)',
              }}
            />
          </Box>

          {/* Settings Content */}
          <Box sx={{ px: 3, pb: 3 }}>
            {/* Tabs */}
            <Box sx={{ pt: 2 }}>
              <WalletTabs
                tabs={SETTINGS_TABS}
                activeTab={activeSettingsTab}
                onChange={setActiveSettingsTab}
              />
            </Box>

            {/* Tab Content */}
            <Box sx={{ mt: 3 }}>
              {activeSettingsTab === 0 && <WalletSettingsList />}
              {activeSettingsTab === 1 && <CurrencySelector />}
            </Box>
          </Box>
        </>
      );
    }

    return (
      <>
        {/* Header with close button */}
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 1,
          }}
        >
          <CircleIconButton
            onClick={onClose}
            icon={<Iconify icon="mint:cross" width={16} height={16} />}
          />
        </Box>

        {/* Content */}
        <Box sx={{ p: 4, color: '#fff' }}>
          {/* Total Balance Section */}
          <Box sx={{ mb: 3 }}>
            <Text
              variant="body2"
              sx={{
                color: '#949AA2',
                mb: 0.5,
              }}
            >
              Total Estimated Balance
            </Text>
            <Text
              variant="h4"
              sx={{
                color: '#FFF',
              }}
            >
              {getTotalEstimatedBalance()}
            </Text>
          </Box>

          {/* Action Buttons */}
          <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
            <WalletButton
              variant="primary"
              onClick={handleCashierClick}
              icon={<Iconify icon="mint:header-plus" width={20} height={20} sx={{ mr: 1 }} />}
              sx={{ flex: 1 }}
            >
              Cashier
            </WalletButton>
            <WalletButton
              variant="secondary"
              onClick={handleSettingsClick}
              icon={<Iconify icon="mint:header-settings" width={20} height={20} sx={{ mr: 1 }} />}
              sx={{ flex: 1 }}
            >
              Settings
            </WalletButton>
          </Stack>

          {/* Currency List */}
          <Box sx={{ mb: 3 }}>
            {enabledAccounts.map((account) => (
              <WalletCurrencyItem
                key={account.currency}
                account={account}
                selectedCurrency={selectedCurrency}
                formatBalance={formatBalance}
                currencies={currencies}
                onSelect={handleSelectAccount}
                isSelecting={isSelectingAccount}
              />
            ))}
          </Box>

          {/* Manage Wallets Button */}
          <WalletButton
            variant="outlined"
            fullWidth
            icon={<Iconify icon="mint:header-wallet" width={20} height={20} sx={{ mr: 1 }} />}
          >
            Manage Wallets
          </WalletButton>
        </Box>
      </>
    );
  };

  // Render as dropdown container when asDropdown is true
  if (asDropdown) {
    return (
      <>
        <Box
          sx={{
            width: 480,
            maxHeight: '90vh',
            overflow: 'auto',
            borderRadius: '16px',
            background: 'var(--background-paper, color(display-p3 0.1294 0.1373 0.1529))',
            boxShadow: '0 4px 24px 0 color(display-p3 1 1 1 / 0.08) inset, 0 1px 1px 0 color(display-p3 0.0886 1 0.8937 / 0.25) inset, 0 -1px 1px 0 color(display-p3 0 0 0 / 0.25) inset, var(--card-x1, 0) var(--card-y1, 0) var(--card-blur1, 2px) var(--card-spread1, 0) var(--shadow-20, color(display-p3 0 0 0 / 0.20)), var(--card-x2, 0) var(--card-y2, 12px) var(--card-blur2, 24px) var(--card-spread2, -4px) var(--shadow-12, color(display-p3 0 0 0 / 0.12))',
            backdropFilter: 'blur(4px)',
            position: 'relative',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          {renderDialogContent()}
        </Box>

      </>
    );
  }

  return (
    <>
      <GlassDialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            p: 0,
            maxWidth: 480,
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxSizing: 'border-box',
            position: 'relative',
          }
        }}
      >
        {renderDialogContent()}
      </GlassDialog>

    </>
  );
}

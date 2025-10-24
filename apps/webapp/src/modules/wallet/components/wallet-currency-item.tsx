'use client';

import { Box } from '@mint/ui/components/core';
import { Iconify } from '@mint/ui/components/iconify';
import { CurrencyItem, Text } from '@mint/ui/components';
import { Currency } from '@/hooks/useCurrencies';

interface Account {
  id?: number;
  currency: string;
  balanceCents: number;
  moneyBalanceCents: number;
  bonusBalanceCents: number;
  withdrawBalanceCents: number;
  eurBalanceCents: number;
  usdBalanceCents: number;
  main: boolean;
  selected: boolean;
  selected_currency: string;
  selected_currency_cents: number;
  enabled: boolean; // Whether the currency is shown in the wallet list
}

interface WalletCurrencyItemProps {
  account: Account;
  selectedCurrency: string;
  formatBalance: (cents: number, currency: string) => string;
  currencies: Currency[];
  onSelect?: (currency: string) => void;
  isSelecting?: boolean;
}

export function WalletCurrencyItem({ account, selectedCurrency, formatBalance, currencies, onSelect, isSelecting = false }: WalletCurrencyItemProps) {
  const { currency, balanceCents, selected_currency, selected_currency_cents } = account;

  // Find currency data from the provided currencies array
  const currencyData = currencies.find(c => c.code === currency);

  const handleClick = () => {
    // Don't allow selection if already selected or if a selection is in progress
    if (onSelect && !account.selected && !isSelecting) {
      onSelect(currency);
    }
  };

  // Calculate balance in selected currency
  const getDisplayBalance = () => {
    const balanceToUse = selected_currency_cents;
    const currencyToUse = selected_currency;

    return formatBalance(balanceToUse, currencyToUse);
  };

  const getNativeBalance = () => {
    const nativeAmount = balanceCents / 100;
    return nativeAmount.toFixed(8);
  };

  // Get icon and name from currency data or fallback
  const iconKey = currencyData?.icon || `crypto:${currency.toLowerCase()}`;
  const currencyName = currencyData?.name || currency;

  return (
    <CurrencyItem
      icon={<Iconify icon={iconKey} width={24} height={24} />}
      title={currencyName}
      subtitle={currency}
      selected={account.selected}
      onClick={handleClick}
      sx={{
        border: 'none',
        ...(account.selected ? {
          borderRadius: '10px',
          background: 'rgba(148, 154, 162, 0.12)',
          boxShadow: '0 4px 24px 0 rgba(255, 255, 255, 0.08) inset, 0 1px 1px 0 rgba(0, 255, 228, 0.25) inset, 0 -1px 1px 0 rgba(0, 0, 0, 0.25) inset',
          backdropFilter: 'blur(4px)',
          cursor: 'default',
        } : {
          background: 'transparent',
          cursor: isSelecting ? 'not-allowed' : 'pointer',
          opacity: isSelecting ? 0.5 : 1,
        }),
        '&:hover': {
          backgroundColor: account.selected || isSelecting ? (account.selected ? 'rgba(148, 154, 162, 0.12)' : 'transparent') : 'rgba(255, 255, 255, 0.05)',
        },
      }}
      rightContent={
        <Box sx={{ textAlign: 'right' }}>
          <Text
            variant="body1"
            sx={{
              color: '#fff',
              fontWeight: 600,
            }}
          >
            {getDisplayBalance()}
          </Text>
          <Text
            variant="body2"
            sx={{
              color: 'rgba(255, 255, 255, 0.6)',
            }}
          >
            {getNativeBalance()}
          </Text>
        </Box>
      }
    />
  );
}

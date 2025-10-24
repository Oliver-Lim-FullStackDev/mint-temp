'use client';

import { Box, Grid } from '@mint/ui/components/core';
import { Iconify } from '@mint/ui/components/iconify';
import { SelectableButton, Text } from '@mint/ui/components';
import { useCurrencies, CurrencyType } from '@/hooks/useCurrencies';
import { useSession } from '@/modules/account/session-store';
import { useSelectCurrency } from '@/modules/session/hooks';

export function CurrencySelector() {
  const { session } = useSession();
  const { selectCurrency, isLoading } = useSelectCurrency();
  const { currencies: fiatCurrencies, isLoading: isCurrenciesLoading } = useCurrencies({ type: CurrencyType.FIAT });

  const player = session?.player;
  const selectedCurrency = player?.account?.selected_currency || 'USD';

  const handleCurrencySelect = (currencyCode: string) => {
    if (currencyCode === selectedCurrency) return;

    const token = session?.token;
    if (!token) {
      console.error('No session token available');
      return;
    }

    selectCurrency({ currencyCode, token });
  };

  if (isCurrenciesLoading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Text variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
          Loading currencies...
        </Text>
      </Box>
    );
  }

  return (
    <Box>
      <Grid container spacing={1}>
        {fiatCurrencies.map((currency) => {
          const isSelected = currency.code === selectedCurrency;

          return (
            <Grid key={currency.code} size={{ xs: 4 }}>
              <SelectableButton
                selected={isSelected}
                onClick={() => handleCurrencySelect(currency.code)}
                disabled={isLoading || isCurrenciesLoading}
                fullWidth
                sx={{ flexDirection: 'row' }}
              >
                {/* Flag Icon */}
                <Box
                  sx={{
                    width: 24,
                    height: 18,
                    borderRadius: '2px',
                    background: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}
                >
                  <Iconify
                    icon={currency.icon}
                    width={20}
                    height={20}
                    sx={{
                      borderRadius: '2px',
                      objectFit: 'cover',
                    }}
                  />
                </Box>

                {/* Currency Code */}
                <Text
                  variant="caption"
                  sx={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'inherit',
                    lineHeight: 1,
                  }}
                >
                  {currency.code}
                </Text>
              </SelectableButton>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

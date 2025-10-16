"use client";

import { memo } from 'react';
import { Text } from '@mint/ui/components';
import { Stack } from '@mint/ui/components/core';
import { Iconify } from '@mint/ui/components/iconify';
import { useFormatBalance } from '@/hooks/useFormatBalance';
import { BalanceType } from '@/utils/number-formatting';

export type CoinType = 'XPP' | 'MBX' | 'RTP' | 'STARS';

interface ListItemCoinProps {
  XPP?: number;
  MBX?: number;
  RTP?: number;
  STARS?: number;
}

const coinConfig = {
  XPP: {
    icon: <img src="/assets/icons/components/ic-xp.svg" alt="XPP" width={16} height={16} />,
    textColor: undefined,
  },
  MBX: {
    icon: <Iconify icon="mint:buck-icon" width={16} height={16} />,
    textColor: undefined,
  },
  RTP: {
    icon: <Iconify icon="mint:raffle-ticket-icon" width={16} height={16} />,
    textColor: undefined,
  },
  STARS: {
    icon: <Iconify icon="mint:telegram-stars" width={16} height={16} />,
    textColor: undefined,
  },
};

export function ListItemCoin({ XPP = 0, MBX = 0, RTP = 0, STARS = 0 }: ListItemCoinProps) {
  const coinTypes: CoinType[] = ['XPP', 'MBX', 'RTP', 'STARS'];
  const coinValues = { XPP, MBX, RTP, STARS };
    const { formatBalance } = useFormatBalance();


  const renderCoinItem = (type: CoinType) => {
    const amount = coinValues[type];

    // Only render if amount is greater than 0
    if (amount <= 0) return null;

    const config = coinConfig[type];

    return (
      <Stack key={type} direction="row" alignItems="center" spacing={0.5}>
        {config.icon}
        <Text
          variant='caption'
          sx={{
            fontWeight: "500",
            fontSize: '12px',
            color: config.textColor || 'inherit'
          }}
        >
          {formatBalance(amount, type as BalanceType)}
        </Text>
      </Stack>
    );
  };

  const visibleCoins = coinTypes.filter(type => coinValues[type] > 0);

  // Don't render anything if no coins have amounts > 0
  if (visibleCoins.length === 0) return null;

  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      {coinTypes.map(renderCoinItem)}
    </Stack>
  );
}

export default memo(ListItemCoin);

import type { TypographyProps } from '@mint/ui/components/core';
import { Typography } from '@mint/ui/components/core';

interface AmountProps extends TypographyProps {
  amount: number | string;
  currency?: string;
}

export function Amount({ amount, currency, ...typographyProps }: AmountProps) {
  const numericAmount = Number(amount);
  const formattedAmount = numericAmount.toLocaleString();

  return (
    <Typography {...typographyProps}>
      {currency ? `${currency} ${formattedAmount}` : formattedAmount}
    </Typography>
  );
}

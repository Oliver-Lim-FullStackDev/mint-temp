import type { TypographyProps } from '@mint/ui';
import { Typography } from '@mint/ui';

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

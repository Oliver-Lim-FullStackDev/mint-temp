import type { ReactNode } from 'react';
import type { Theme, SxProps, ButtonProps } from '@mui/material';

import { Button } from '@mui/material';

export interface WalletButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'outlined';
  icon?: ReactNode;
  children: ReactNode;
}

/**
 * Reusable wallet button component with predefined variants
 * - primary: Green button with inset shadow (Cashier button style)
 * - secondary: Transparent button with white text
 * - outlined: Outlined button with teal border
 */
export function WalletButton({
  variant = 'primary',
  icon,
  children,
  sx,
  ...props
}: WalletButtonProps) {
  const getVariantStyles = (): SxProps<Theme> => {
    switch (variant) {
      case 'primary':
        return {
          height: 48,
          borderRadius: '10px',
          borderTop: '1px solid rgba(255, 255, 255, 0.35)',
          background: '#009C79',
          color: '#FFF',
          fontSize: '14px',
          fontWeight: 700,
          lineHeight: '24px',
          textTransform: 'none',
          textAlign: 'center',
          boxShadow: '0 12px 8px 0 rgba(255, 255, 255, 0.08) inset, 0 -12px 8px 0 rgba(0, 0, 0, 0.12) inset',
          '&:hover': {
            background: '#008A6B',
          },
          '&:disabled': {
            opacity: 0.5,
            background: '#009C79',
          },
        };

      case 'secondary':
        return {
          height: 48,
          borderRadius: '12px',
          color: '#FFF',
          fontSize: '14px',
          fontWeight: 700,
          lineHeight: '24px',
          textTransform: 'none',
          textAlign: 'center',
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.05)',
          },
        };

      case 'outlined':
        return {
          height: 48,
          borderRadius: '10px',
          border: '1px solid rgba(0, 249, 199, 0.16)',
          color: '#00FFE5',
          fontSize: '14px',
          fontWeight: 700,
          lineHeight: '24px',
          textTransform: 'none',
          textAlign: 'center',
          '&:hover': {
            border: '1px solid rgba(0, 249, 199, 0.32)',
            background: 'rgba(0, 249, 199, 0.05)',
          },
        };

      default:
        return {};
    }
  };

  const combinedSx: SxProps<Theme> = [
    getVariantStyles(),
    ...(Array.isArray(sx) ? sx : [sx]),
  ];

  return (
    <Button
      sx={combinedSx}
      {...props}
    >
      {icon}
      {children}
    </Button>
  );
}


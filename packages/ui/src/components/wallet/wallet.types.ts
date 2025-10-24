import type { ReactNode } from 'react';
import type { Theme, SxProps } from '@mui/material';

export interface WalletButtonVariant {
  variant: 'primary' | 'secondary' | 'outlined';
}

export interface CurrencyItemProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  rightContent?: ReactNode;
  selected?: boolean;
  onClick?: () => void;
  sx?: SxProps<Theme>;
}

export interface CircleIconButtonProps {
  icon: ReactNode;
  onClick?: () => void;
  size?: 'small' | 'medium' | 'large';
  sx?: SxProps<Theme>;
}

export interface SelectableButtonProps {
  selected?: boolean;
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  sx?: SxProps<Theme>;
}


import type { ReactNode } from 'react';
import type { BoxProps } from '@mui/material';

import { Box, Stack } from '@mui/material';

export interface CurrencyItemProps extends Omit<BoxProps, 'onClick'> {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  rightContent?: ReactNode;
  selected?: boolean;
  onClick?: () => void;
}

/**
 * Reusable currency/wallet item component
 * Used for displaying currency balances, settings items, etc.
 */
export function CurrencyItem({
  icon,
  title,
  subtitle,
  rightContent,
  selected = false,
  onClick,
  sx,
  ...props
}: CurrencyItemProps) {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        py: 2,
        px: 2,
        borderRadius: '12px',
        background: 'rgba(255, 255, 255, 0.02)',
        border: selected ? '1px solid rgba(0, 241, 203, 0.3)' : '1px solid rgba(255, 255, 255, 0.05)',
        transition: 'all 0.2s ease',
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick ? {
          background: 'rgba(255, 255, 255, 0.05)',
        } : undefined,
        ...sx,
      }}
      {...props}
    >
      {/* Left side - Icon and info */}
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {icon}
        </Box>
        <Box>
          <Box
            sx={{
              color: '#fff',
              fontWeight: 600,
              fontSize: '16px',
              lineHeight: 1.2,
            }}
          >
            {title}
          </Box>
          {subtitle && (
            <Box
              sx={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '14px',
                lineHeight: 1.2,
                mt: 0.5,
              }}
            >
              {subtitle}
            </Box>
          )}
        </Box>
      </Stack>

      {/* Right side content */}
      {rightContent && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {rightContent}
        </Box>
      )}
    </Box>
  );
}


import type { ButtonProps } from '@mui/material';

import { Button } from '@mui/material';

export interface SelectableButtonProps extends Omit<ButtonProps, 'variant'> {
  selected?: boolean;
}

/**
 * Reusable selectable button component (used for currency selection, tabs, etc.)
 * Changes appearance based on selected state
 */
export function SelectableButton({
  selected = false,
  children,
  sx,
  ...props
}: SelectableButtonProps) {
  return (
    <Button
      sx={{
        display: 'flex',
        minWidth: '64px',
        padding: '8px 10px',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '8px',
        flex: '1 0 0',
        alignSelf: 'stretch',
        borderRadius: '10px',
        background: selected
          ? '#009C79'
          : 'rgba(0, 249, 199, 0.08)',
        borderTop: selected
          ? '1px solid rgba(255, 255, 255, 0.35)'
          : 'none',
        boxShadow: selected
          ? '0 12px 8px 0 rgba(255, 255, 255, 0.08) inset, 0 -12px 8px 0 rgba(0, 0, 0, 0.12) inset'
          : 'none',
        color: selected ? '#FFF' : '#00FFE5',
        fontWeight: 600,
        fontSize: '14px',
        textTransform: 'none',
        '&:hover': {
          background: selected
            ? '#008A6B'
            : 'rgba(0, 249, 199, 0.12)',
        },
        '&:disabled': {
          opacity: 0.5,
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Button>
  );
}


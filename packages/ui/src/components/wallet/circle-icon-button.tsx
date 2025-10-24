import type { ReactNode } from 'react';
import type { IconButtonProps } from '@mui/material';

import { IconButton } from '@mui/material';

export interface CircleIconButtonProps extends Omit<IconButtonProps, 'size'> {
  icon: ReactNode;
  size?: 'small' | 'medium' | 'large';
}

/**
 * Reusable circular icon button with semi-transparent background
 * Used for back/close buttons in dialogs
 */
export function CircleIconButton({
  icon,
  size = 'medium',
  sx,
  ...props
}: CircleIconButtonProps) {
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { width: 28, height: 28 };
      case 'large':
        return { width: 40, height: 40 };
      case 'medium':
      default:
        return { width: 32, height: 32 };
    }
  };

  return (
    <IconButton
      sx={{
        ...getSizeStyles(),
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.1)',
        color: '#fff',
        '&:hover': {
          background: 'rgba(255, 255, 255, 0.2)',
        },
        ...sx,
      }}
      {...props}
    >
      {icon}
    </IconButton>
  );
}


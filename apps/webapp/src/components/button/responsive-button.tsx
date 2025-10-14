'use client';

import { ReactNode } from 'react';
import { useTheme } from '@mui/material';
import type { ButtonProps } from '@mint/ui';
import { Breakpoint, Button, Slide } from '@mint/ui/components';
import useMediaQuery from '@mui/material/useMediaQuery';

export interface ButtonResponsiveProps extends ButtonProps {
  label?: string;
  hideLabelBelow?: Breakpoint;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}

export function ButtonResponsive({
  children,
  hideLabelBelow = 'md',
  startIcon,
  endIcon,
  sx,
  ...props
}: ButtonResponsiveProps) {
  const theme = useTheme();
  const showChildren = useMediaQuery(theme.breakpoints.up(hideLabelBelow));

  return (
    <Button
      {...props}
      startIcon={startIcon}
      endIcon={endIcon}
      sx={{
        minWidth: 'auto',
        '& .MuiButton-startIcon': {
          marginRight: showChildren ? undefined : 0,
          marginLeft: showChildren ? undefined : 0,
        },
        '& .MuiButton-endIcon': {
          marginLeft: showChildren ? undefined : 0,
          marginRight: showChildren ? undefined : 0,
        },
        ...sx,
      }}
    >
      <Slide in={showChildren} direction="right" timeout={150} unmountOnExit>
        <span>{children}</span>
      </Slide>
    </Button>
  );
}

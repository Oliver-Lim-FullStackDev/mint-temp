import { forwardRef } from 'react';
import type { BoxProps } from '@mint/ui';
import { Box } from '@mint/ui/components';

export interface GlassCardProps extends BoxProps {
  children?: React.ReactNode;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ children, sx, ...other }, ref) => (
    <Box
      ref={ref}
      sx={[
        {
          display: 'flex',
          padding: (theme) => theme.spacing(2),
          flexDirection: 'column',
          alignItems: 'center',
          gap: '11px',
          borderRadius: 'var(--card-radius, 16px)',
          background: 'rgba(18, 28, 38, 0.48)',
          boxShadow: '0px 4px 24px 0px rgba(255, 255, 255, 0.08) inset, 0px 1px 1px 0px rgba(0, 255, 228, 0.25) inset, 0px -1px 1px 0px rgba(0, 0, 0, 0.25) inset, var(--card-x1, 0px) var(--card-y1, 0px) var(--card-blur1, 2px) var(--card-spread1, 0px) var(--shadow-20, rgba(0, 0, 0, 0.20)), var(--card-x2, 0px) var(--card-y2, 12px) var(--card-blur2, 24px) var(--card-spread2, -4px) var(--shadow-12, rgba(0, 0, 0, 0.12))',
          backdropFilter: 'blur(4px)',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {children}
    </Box>
  )
);

GlassCard.displayName = 'GlassCard';

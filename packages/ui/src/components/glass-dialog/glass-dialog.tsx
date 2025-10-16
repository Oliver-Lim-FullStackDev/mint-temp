import { forwardRef } from 'react';

import type { DialogProps } from '../core';

import { Dialog } from '../core';

export interface GlassDialogProps extends Omit<DialogProps, 'PaperComponent'> {
  children?: React.ReactNode;
}

export const GlassDialog = forwardRef<HTMLDivElement, GlassDialogProps>(
  ({ children, sx, ...other }, ref) => (
    <Dialog
      ref={ref}
      sx={{
        zIndex: 'var(--layout-modal-zIndex, 10003)',
      }}
      PaperProps={{
        sx: [
          {
            borderRadius: 'var(--dialog-radius, 16px)',
            background: 'var(--background-paper, color(display-p3 0.1294 0.1373 0.1529))',
            boxShadow: [
              '0px 4px 24px 0px color(display-p3 1 1 1 / 0.08) inset',
              '0px 1px 1px 0px color(display-p3 0.0886 1 0.8937 / 0.25) inset',
              '0px -1px 1px 0px color(display-p3 0 0 0 / 0.25) inset',
              'var(--card-x1, 0px) var(--card-y1, 0px) var(--card-blur1, 2px) var(--card-spread1, 0px) var(--shadow-20, color(display-p3 0 0 0 / 0.20))',
              'var(--card-x2, 0px) var(--card-y2, 12px) var(--card-blur2, 24px) var(--card-spread2, -4px) var(--shadow-12, color(display-p3 0 0 0 / 0.12))'
            ].join(', '),
            backdropFilter: 'blur(4px)',
            maxWidth: 480,
            width: '100%',
            margin: '16px',
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ],
      }}
      {...other}
    >
      {children}
    </Dialog>
  )
);

GlassDialog.displayName = 'GlassDialog';

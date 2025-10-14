import type { BoxProps, Theme } from '@mint/ui';
import { Box } from '@mint/ui/components';
import { forwardRef } from 'react';


export type GlassBoxVariant = 'glass' | 'glass-box';
export type GlassBoxProps = BoxProps & {
  variant?: GlassBoxVariant;
};

export const GlassBox = forwardRef<HTMLDivElement, GlassBoxProps>(
  ({ variant = 'glass', sx, ...other }, ref) => {
    const getVariantStyles = (theme: Theme) => {
      switch (variant) {
        case 'glass':
          return {
            borderRadius: '12px',
            background: 'var(--components-backdrop, #161C247A)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: [
              'var(--cardx2) var(--cardy2) var(--cardblur2) var(--cardspread2) var(--shadow12)',
              'var(--cardx1) var(--cardy1) var(--cardblur1) var(--cardspread1) var(--shadow20)',
              '0px -1px 1px 0px #00000040 inset',
              '0px 1px 1px 0px #17FFE440 inset',
              '0px 4px 24px 0px #FFFFFF14 inset'
            ].join(', '),
          };
        case 'glass-box':
          return {
            borderRadius: '12px',
            background: 'color(display-p3 0.5882 0.6039 0.6275 / 0.08)',
            boxShadow: `
              inset 0 4px 24px 0 color(display-p3 1 1 1 / 0.08),
              inset 0 1px 1px 0 color(display-p3 0.0886 1 0.8937 / 0.25),
              inset 0 -1px 1px 0 color(display-p3 0 0 0 / 0.25)
            `,
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
          };

        default:
          return {};
      }
    };

    return (
      <Box
        ref={ref}
        sx={[
          (theme) => getVariantStyles(theme),
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...other}
      />
    );
  }
);

GlassBox.displayName = 'GlassBox';

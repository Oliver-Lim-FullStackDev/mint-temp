import type { TypographyProps as MuiTypographyProps } from '@mui/material';

import React from 'react';

import { Typography as MuiTypography } from '@mint/ui/components';
import type { SxProps, Theme } from '@mui/material/styles';

// Color configuration
const colorConfig = {
  'text-primary': '#FFFFFF',
  'text-secondary': '#969AA0',
  'text-primary-darker': '#00241D',
  'primary-blue-main': 'var(--brand-primary-blue-main)',
  'secondary-main': 'var(--secondary-main, color(display-p3 0.8235 1 0.1098))',
};

export type TextColor = keyof typeof colorConfig;

// Available font families
export type FontFamily =
  | 'Mattone'
  | 'Red Hat Display'
  | 'Red Hat Mono'
  | 'Red Hat Text';

// Typography variant types
export type TextVariant =
  | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  | 'subtitle1' | 'subtitle2'
  | 'body1' | 'body2' | 'body3' | 'body4'
  | 'caption' | 'overline' | 'button'
  | 'onboardingTitle' | 'onboardingBody'
  | 'inherit';

export interface TextProps extends Omit<MuiTypographyProps, 'color' | 'variant'> {
  color?: TextColor | MuiTypographyProps['color'];
  variant?: TextVariant;
  fontFamily?: FontFamily;
  centered?: boolean;
}

// Typography variants configuration with direct font family assignments
const textVariants = {
  h1: {
    fontFamily: 'Mattone',
    fontSize: '64px',
    fontWeight: '900',
    lineHeight: '80px',
    letterSpacing: '0px',
    paragraphSpacing: '0px',
    '@media (max-width: 768px)': {
      fontSize: '40px',
      lineHeight: '50px',
    },
  },
  h2: {
    fontFamily: 'Mattone',
    fontSize: '48px',
    fontWeight: '900',
    lineHeight: '64px',
    letterSpacing: '0px',
    paragraphSpacing: '0px',
    '@media (max-width: 768px)': {
      fontSize: '32px',
      lineHeight: '42.67px',
    },
  },
  h3: {
    fontFamily: 'Mattone',
    fontSize: '32px',
    fontWeight: '700',
    lineHeight: '48px',
    letterSpacing: '0px',
    paragraphSpacing: '0px',
    '@media (max-width: 768px)': {
      fontSize: '24px',
      lineHeight: '36px',
    },
  },
  h4: {
    fontFamily: 'Red Hat Display',
    fontSize: '24px',
    fontWeight: '700',
    lineHeight: '36px',
    letterSpacing: '0px',
    paragraphSpacing: '0px',
    '@media (max-width: 768px)': {
      fontSize: '20px',
      lineHeight: '30px',
    },
  },
  h5: {
    fontFamily: 'Red Hat Display',
    fontSize: '20px',
    fontWeight: '700',
    lineHeight: '30px',
    letterSpacing: '0px',
    paragraphSpacing: '0px',
    '@media (max-width: 768px)': {
      fontSize: '18px',
      lineHeight: '27px',
    },
  },
  h6: {
    fontFamily: 'Red Hat Display',
    fontSize: '18px',
    fontWeight: '600',
    lineHeight: '28px',
    letterSpacing: '0px',
    paragraphSpacing: '0px',
    '@media (max-width: 768px)': {
      fontSize: '17px',
      lineHeight: '26.44px',
    },
  },
  subtitle1: {
    fontFamily: 'Red Hat Text',
    fontSize: '16px',
    fontWeight: '600',
    lineHeight: '24px',
    letterSpacing: '0px',
    paragraphSpacing: '0px',
    '@media (max-width: 768px)': {
      fontSize: '16px',
      lineHeight: '24px',
    },
  },
  subtitle2: {
    fontFamily: 'Red Hat Text',
    fontSize: '14px',
    fontWeight: '600',
    lineHeight: '22px',
    letterSpacing: '0px',
    paragraphSpacing: '0px',
    '@media (max-width: 768px)': {
      fontSize: '14px',
      lineHeight: '22px',
    },
  },
  body1: {
    fontFamily: 'Red Hat Text',
    fontSize: '16px',
    fontWeight: '400',
    lineHeight: '24px',
    letterSpacing: '0px',
    paragraphSpacing: '0px',
    '@media (max-width: 768px)': {
      fontSize: '16px',
      lineHeight: '24px',
    },
  },
  body2: {
    fontFamily: 'Red Hat Text',
    fontSize: '14px',
    fontWeight: '400',
    lineHeight: '22px',
    letterSpacing: '0px',
    paragraphSpacing: '0px',
    '@media (max-width: 768px)': {
      fontSize: '14px',
      lineHeight: '22px',
    },
  },
  body3: {
    fontFamily: 'Red Hat Text',
    fontSize: '12px',
    fontWeight: '400',
    lineHeight: '18px',
    letterSpacing: '0px',
    paragraphSpacing: '0px',
    '@media (max-width: 768px)': {
      fontSize: '12px',
      lineHeight: '18px',
    },
  },
  body4: {
    fontFamily: 'Red Hat Text',
    fontSize: '10px',
    fontWeight: '400',
    lineHeight: '16px',
    letterSpacing: '0px',
    paragraphSpacing: '0px',
    '@media (max-width: 768px)': {
      fontSize: '10px',
      lineHeight: '16px',
    },
  },
  caption: {
    fontFamily: 'Red Hat Text',
    fontSize: '12px',
    fontWeight: '400',
    lineHeight: '18px',
    letterSpacing: '0px',
    paragraphSpacing: '0px',
    '@media (max-width: 768px)': {
      fontSize: '12px',
      lineHeight: '18px',
    },
  },
  overline: {
    fontFamily: 'Red Hat Text',
    fontSize: '12px',
    fontWeight: '700',
    lineHeight: '18px',
    letterSpacing: '0px',
    paragraphSpacing: '0px',
    '@media (max-width: 768px)': {
      fontSize: '12px',
      lineHeight: '18px',
    },
  },
  onboardingTitle: {
    fontFamily: 'Mattone',
    fontSize: '40px',
    fontWeight: '900',
    lineHeight: '50px',
    letterSpacing: '0px',
    paragraphSpacing: '0px',
    '@media (max-width: 768px)': {
      fontSize: '32px',
      lineHeight: '40px',
    },
  },
  onboardingBody: {
    fontFamily: 'Red Hat Text',
    fontSize: '14px',
    fontWeight: '400',
    lineHeight: '22px',
    letterSpacing: '0px',
    paragraphSpacing: '0px',
    '@media (max-width: 768px)': {
      fontSize: '14px',
      lineHeight: '22px',
    },
  },
};

// Enhanced Text component with improved readability and font family support
export const Text = React.forwardRef<HTMLElement, TextProps>(
  ({ color, variant, fontFamily, centered, sx, ...other }, ref) => {
    const computedSx: Record<string, unknown> = {};
    const isCustomColor = typeof color === 'string' && color in colorConfig;

    if (isCustomColor) {
      computedSx.color = colorConfig[color as TextColor];
    }

    if (variant && variant in textVariants) {
      Object.assign(computedSx, textVariants[variant as keyof typeof textVariants]);
    }

  if (fontFamily) {
    computedSx.fontFamily = fontFamily;
  }

  if (centered) {
    computedSx.textAlign = 'center';
    }

    const hasComputedStyles = Object.keys(computedSx).length > 0;

    const mergedSx: SxProps<Theme> | undefined = hasComputedStyles
      ? ([
          computedSx as SxProps<Theme>,
          ...(Array.isArray(sx) ? sx : sx != null ? [sx] : []),
        ] as SxProps<Theme>)
      : sx;

    const muiColor = !isCustomColor ? (color as MuiTypographyProps['color']) : undefined;

    return (
      <MuiTypography
        ref={ref}
        color={muiColor}
        variant={variant as any}
        sx={mergedSx}
        {...other}
      />
    );
  }
);

Text.displayName = 'Text';

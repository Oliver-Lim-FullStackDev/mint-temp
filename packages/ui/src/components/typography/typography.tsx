'use client';

import type { TypographyProps as MuiTypographyProps } from '@mui/material';

import React from 'react';

import { styled } from '@mui/material/styles';
import { Typography as MuiTypography } from '@mui/material';

// Color configuration
const colorConfig = {
  'text-primary': '#FFFFFF',
  'text-secondary': '#969AA0',
  'text-primary-darker': '#00241D',
  'primary-blue-main': '#00F1CB',
};

export type TypographyColor = keyof typeof colorConfig;

// Typography variant types
export type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'subtitle1'
  | 'subtitle2'
  | 'body1'
  | 'body2'
  | 'body3'
  | 'body4'
  | 'caption'
  | 'overline'
  | 'button'
  | 'onboardingTitle'
  | 'onboardingBody'
  | 'inherit';

export interface TypographyProps extends Omit<MuiTypographyProps, 'color' | 'variant'> {
  color?: TypographyColor | MuiTypographyProps['color'];
  variant?: TypographyVariant;
}

// Typography variants configuration based on the provided specifications
const typographyVariants = {
  h1: {
    fontFamily: 'family/secondary',
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
    fontFamily: 'family/secondary',
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
    fontFamily: 'family/secondary',
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
    fontFamily: 'family/primary',
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
    fontFamily: 'family/primary',
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
    fontFamily: 'family/primary',
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
    fontFamily: 'family/primary',
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
    fontFamily: 'family/primary',
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
    fontFamily: 'family/primary',
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
    fontFamily: 'family/primary',
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
    fontFamily: 'family/primary',
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
    fontFamily: 'family/primary',
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
    fontFamily: 'family/primary',
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
    fontFamily: 'family/primary',
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
    fontFamily: 'family/secondary',
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
    fontFamily: 'family/primary',
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

const StyledTypography = styled(MuiTypography)<TypographyProps>(({ color, variant, theme }) => ({
  // Apply custom color if provided
  ...(color &&
    typeof color === 'string' &&
    color in colorConfig && {
      color: colorConfig[color as TypographyColor],
    }),

  // Apply typography variant styles
  ...(variant &&
    variant in typographyVariants && {
      ...typographyVariants[variant as keyof typeof typographyVariants],
      // Map font family references to actual theme fonts
      fontFamily:
        typographyVariants[variant as keyof typeof typographyVariants].fontFamily ===
        'family/secondary'
          ? theme.typography.fontSecondaryFamily
          : theme.typography.fontFamily,
      // Map font weight references to actual values
      fontWeight: (() => {
        const weightMap = {
          '400': theme.typography.fontWeightRegular,
          '600': theme.typography.fontWeightSemiBold,
          '700': theme.typography.fontWeightBold,
          '900': 900,
        };
        const weightKey = typographyVariants[variant as keyof typeof typographyVariants]
          .fontWeight as keyof typeof weightMap;
        return weightMap[weightKey] || theme.typography.fontWeightRegular;
      })(),
    }),
}));

export const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ color, variant, ...other }, ref) => {
    // Use StyledTypography for custom variants or colors
    if (
      (color && typeof color === 'string' && color in colorConfig) ||
      (variant && variant in typographyVariants)
    ) {
      return <StyledTypography ref={ref} color={color} variant={variant as any} {...other} />;
    }

    // Otherwise, use the default MUI Typography
    return (
      <MuiTypography
        ref={ref}
        color={color as MuiTypographyProps['color']}
        variant={variant as any}
        {...other}
      />
    );
  }
);

Typography.displayName = 'Typography';

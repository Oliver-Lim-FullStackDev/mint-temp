'use client';

import type { ButtonProps as MuiButtonProps } from '@mui/material';

import React from 'react';

import { Button as MuiButton } from '@mui/material';

import { Text } from '../typography/text';

import type { FontFamily } from '../typography/text';

// Define the custom variant types
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonStyle = 'filled' | 'outlined' | 'borderless';
export type ButtonColor = 
  | 'inherit' 
  | 'primary' 
  | 'secondary' 
  | 'info' 
  | 'success' 
  | 'warning' 
  | 'error';

// Custom props interface that avoids conflicts with MUI props
export interface ButtonProps extends Omit<MuiButtonProps, 'size' | 'variant' | 'color'> {
  size?: ButtonSize;
  buttonStyle?: ButtonStyle;
  color?: ButtonColor;
  bold?: boolean;
  font?: FontFamily;
}

const Button: React.FC<ButtonProps> = ({
  size = 'md',
  buttonStyle = 'borderless',
  color = 'primary',
  bold = false,
  font = 'Red Hat Text',
  children,
  sx,
  ...props
}) => {
  // Size configurations
  const sizeConfig = {
    sm: {
      padding: '8px 16px',
      fontSize: '12px',
      minHeight: '32px',
      minWidth: '64px',
    },
    md: {
      padding: '12px 24px',
      fontSize: '14px',
      minHeight: '40px',
      minWidth: '80px',
    },
    lg: {
      padding: '16px 32px',
      fontSize: '16px',
      minHeight: '48px',
      minWidth: '96px',
    },
  };

  // Color configurations using CSS variables
  const colorConfig = {
    inherit: {
      main: 'var(--global-inherit-bgcolor)',
      hover: 'var(--global-inherit-hover)',
      text: '#000000',
    },
    primary: {
      main: 'var(--primary-main)',
      hover: 'var(--primary-dark)',
      text: '#FFFFFF',
    },
    secondary: {
      main: 'var(--secondary-main)',
      hover: 'var(--secondary-dark)',
      text: '#000000',
    },
    info: {
      main: 'var(--info-main)',
      hover: 'var(--info-dark)',
      text: '#FFFFFF',
    },
    success: {
      main: 'var(--success-main)',
      hover: 'var(--success-dark)',
      text: '#FFFFFF',
    },
    warning: {
      main: 'var(--warning-main)',
      hover: 'var(--warning-dark)',
      text: '#000000',
    },
    error: {
      main: 'var(--error-main)',
      hover: 'var(--error-dark)',
      text: '#FFFFFF',
    },
  };

  const currentSize = sizeConfig[size];
  const currentColor = colorConfig[color];

  // Style configurations
  const getStyleConfig = () => {
    switch (buttonStyle) {
      case 'filled':
        return {
          backgroundColor: currentColor.main,
          color: currentColor.text,
          border: 'none',
          '&:hover': {
            backgroundColor: currentColor.hover,
          },
          '&:disabled': {
            backgroundColor: 'var(--action-disabled-bgcolor)',
            color: 'rgba(255, 255, 255, 0.3)',
          },
        };
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          color: currentColor.main,
          border: `1px solid ${currentColor.main}`,
          '&:hover': {
            backgroundColor: currentColor.main,
            color: currentColor.text,
            borderColor: currentColor.main,
          },
          '&:disabled': {
            borderColor: 'var(--action-disabled-bgcolor)',
            color: 'rgba(255, 255, 255, 0.3)',
          },
        };
      case 'borderless':
      default:
        return {
          backgroundColor: 'transparent',
          color: currentColor.main,
          border: '1px solid transparent',
          '&:hover': {
            backgroundColor: `${currentColor.main}20`, // 20% opacity
            border: `1px solid ${currentColor.main}`,
          },
          '&:disabled': {
            color: 'var(--action-disabled-bgcolor)',
          },
        };
    }
  };

  // Get the display text based on size
  const getDisplayText = () => {
    if (typeof children === 'string') {
      return children;
    }
    
    switch (size) {
      case 'sm':
        return 'Small';
      case 'md':
        return 'Medium';
      case 'lg':
        return 'Large';
      default:
        return 'Button';
    }
  };

  // Combine all styles using sx prop (SSR-friendly)
  const styleConfig = getStyleConfig();
  const combinedSx = {
    borderRadius: '10px',
    textTransform: 'none' as const,
    fontWeight: bold ? 600 : 500,
    fontFamily: font,
    transition: 'all 0.2s ease-in-out',
    padding: currentSize.padding,
    fontSize: currentSize.fontSize,
    minHeight: currentSize.minHeight,
    minWidth: currentSize.minWidth,
    backgroundColor: styleConfig.backgroundColor,
    color: styleConfig.color,
    border: styleConfig.border,
    '&:hover': styleConfig['&:hover'],
    '&:disabled': styleConfig['&:disabled'],
    '&:focus': {
      outline: `2px solid ${currentColor.main}40`,
      outlineOffset: '2px',
    },
    ...sx, // Allow custom sx to override
  };

  return (
    <MuiButton
      sx={combinedSx}
      {...props}
    >
      <Text
        variant={size === 'sm' ? 'body3' : size === 'md' ? 'body2' : 'body1'}
        fontFamily={font}
        sx={{
          fontWeight: bold ? 600 : 500,
          color: 'inherit',
        }}
      >
        {children || getDisplayText()}
      </Text>
    </MuiButton>
  );
};

export { Button };
export default Button;
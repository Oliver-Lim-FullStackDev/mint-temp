'use client';

import React from 'react';
import { Button } from '@mint/ui/components/button';
import { Text } from '@mint/ui/components/typography';

import { Box, Paper } from '@mui/material';

// Type definitions
type ButtonColor = 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error' | 'inherit';
type ButtonSize = 'sm' | 'md' | 'lg';
type ButtonStyle = 'filled' | 'outlined' | 'borderless';
type FontFamily = 'Mattone' | 'Red Hat Display' | 'Red Hat Mono' | 'Red Hat Text' | 'Manrope';

// Get the display text based on size
export const getDisplayText = (size: ButtonSize) => {    
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

export default function ButtonDemoPage() {
  const sizes: ButtonSize[] = ['sm', 'md', 'lg'];
  const styles: ButtonStyle[] = ['filled', 'outlined', 'borderless'];
  const colors: ButtonColor[] = ['primary', 'secondary', 'info', 'success', 'warning', 'error', 'inherit'];
  const fonts: FontFamily[] = ['Mattone', 'Red Hat Display', 'Red Hat Mono', 'Red Hat Text', 'Manrope'];

  return (
    <Box sx={{ padding: 4, minHeight: '100vh' }}>
      <Text variant="h3" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
        Button Component Demo
      </Text>

      {/* Font Variants Grid */}
      <Paper sx={{ padding: 3, marginBottom: 4 }}>
        <Text variant="h5" component="h2" gutterBottom>
          Font Variants
        </Text>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: 2, 
          mb: 2 
        }}>
          {fonts.map((font) => (
            <Button key={font} font={font} size="md" buttonStyle="filled" color="primary">
              {font}
            </Button>
          ))}
        </Box>
      </Paper>

      {/* Color Variants Grid */}
      <Paper sx={{ padding: 3, marginBottom: 4 }}>
        <Text variant="h5" component="h2" gutterBottom>
          Color Variants (Filled Style)
        </Text>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
          gap: 2, 
          mb: 2 
        }}>
          {colors.map((color) => (
            <Button key={color} size="md" buttonStyle="filled" color={color} font="Red Hat Text">
              {color.charAt(0).toUpperCase() + color.slice(1)}
            </Button>
          ))}
        </Box>
      </Paper>

      {/* Color Variants Grid - Outlined */}
      <Paper sx={{ padding: 3, marginBottom: 4 }}>
        <Text variant="h5" component="h2" gutterBottom>
          Color Variants (Outlined Style)
        </Text>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
          gap: 2, 
          mb: 2 
        }}>
          {colors.map((color) => (
            <Button key={color} size="md" buttonStyle="outlined" color={color} font="Red Hat Text">
              {color.charAt(0).toUpperCase() + color.slice(1)}
            </Button>
          ))}
        </Box>
      </Paper>

      {/* Color Variants Grid - Borderless */}
      <Paper sx={{ padding: 3, marginBottom: 4 }}>
        <Text variant="h5" component="h2" gutterBottom>
          Color Variants (Borderless Style)
        </Text>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
          gap: 2, 
          mb: 2 
        }}>
          {colors.map((color) => (
            <Button key={color} size="md" buttonStyle="borderless" color={color} font="Red Hat Text">
              {color.charAt(0).toUpperCase() + color.slice(1)}
            </Button>
          ))}
        </Box>
      </Paper>

      {/* Comprehensive Grid - All Combinations */}
      <Paper sx={{ padding: 3, marginBottom: 4 }}>
        <Text variant="h5" component="h2" gutterBottom>
          Complete Grid - All Size/Style/Color Combinations
        </Text>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', 
          gap: 1.5, 
          mb: 2 
        }}>
          {sizes.map((size) =>
            styles.map((style) =>
              colors.slice(0, 4).map((color) => ( // Limiting to first 4 colors for space
                <Button 
                  key={`${size}-${style}-${color}`} 
                  size={size} 
                  buttonStyle={style} 
                  color={color}
                  font="Red Hat Text"
                >
                  {getDisplayText(size)}
                </Button>
              ))
            )
          )}
        </Box>
      </Paper>
    </Box>
  );
}
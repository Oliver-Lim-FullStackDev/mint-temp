'use client';

import { Text } from "@mint/ui/components";
import { Box, Container } from '@mint/ui/components/core';

export default function ColorsDemoPage() {
  const colorCategories = [
    {
      title: 'Primary Colors',
      colors: [
        { name: 'p-lighter', var: '--p-lighter' },
        { name: 'p-light', var: '--p-light' },
        { name: 'p-main', var: '--p-main' },
        { name: 'p-dark', var: '--p-dark' },
        { name: 'p-darker', var: '--p-darker' },
      ]
    },
    {
      title: 'Secondary Colors',
      colors: [
        { name: 'secondary-lighter', var: '--secondary-lighter' },
        { name: 'secondary-light', var: '--secondary-light' },
        { name: 'secondary-main', var: '--secondary-main' },
        { name: 'secondary-dark', var: '--secondary-dark' },
        { name: 'secondary-darker', var: '--secondary-darker' },
      ]
    },
    {
      title: 'Info Colors',
      colors: [
        { name: 'info-lighter', var: '--info-lighter' },
        { name: 'info-light', var: '--info-light' },
        { name: 'info-main', var: '--info-main' },
        { name: 'info-dark', var: '--info-dark' },
        { name: 'info-darker', var: '--info-darker' },
      ]
    },
    {
      title: 'Success Colors',
      colors: [
        { name: 'success-lighter', var: '--success-lighter' },
        { name: 'success-light', var: '--success-light' },
        { name: 'success-main', var: '--success-main' },
        { name: 'success-dark', var: '--success-dark' },
        { name: 'success-darker', var: '--success-darker' },
      ]
    },
    {
      title: 'Warning Colors',
      colors: [
        { name: 'warning-lighter', var: '--warning-lighter' },
        { name: 'warning-light', var: '--warning-light' },
        { name: 'warning-main', var: '--warning-main' },
        { name: 'warning-dark', var: '--warning-dark' },
        { name: 'warning-darker', var: '--warning-darker' },
      ]
    },
    {
      title: 'Error Colors',
      colors: [
        { name: 'error-lighter', var: '--error-lighter' },
        { name: 'error-light', var: '--error-light' },
        { name: 'error-main', var: '--error-main' },
        { name: 'error-dark', var: '--error-dark' },
        { name: 'error-darker', var: '--error-darker' },
      ]
    },
    {
      title: 'Grey Colors',
      colors: [
        { name: 'grey-0', var: '--grey-0' },
        { name: 'grey-100', var: '--grey-100' },
        { name: 'grey-200', var: '--grey-200' },
        { name: 'grey-300', var: '--grey-300' },
        { name: 'grey-400', var: '--grey-400' },
        { name: 'grey-500', var: '--grey-500' },
        { name: 'grey-600', var: '--grey-600' },
        { name: 'grey-700', var: '--grey-700' },
        { name: 'grey-800', var: '--grey-800' },
        { name: 'grey-900', var: '--grey-900' },
      ]
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Text variant="h1" sx={{ mb: 4, textAlign: 'center' }}>
        Color System Demo
      </Text>

      <Text variant="body1" sx={{ mb: 6, textAlign: 'center', color: 'var(--text-secondary)' }}>
        All colors are now available as CSS custom properties (variables) throughout the application
      </Text>

      {colorCategories.map((category) => (
        <Box key={category.title} sx={{ mb: 6 }}>
          <Text variant="h3" sx={{ mb: 3 }}>
            {category.title}
          </Text>

          <Box sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 2
          }}>
            {category.colors.map((color) => (
              <Box
                key={color.name}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  backgroundColor: `var(${color.var})`,
                  border: '1px solid var(--divider)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 120,
                  position: 'relative',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    borderRadius: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    transition: 'opacity 0.2s',
                    '&:hover': {
                      opacity: 1,
                    }
                  }}
                >
                  <Text variant="body2" sx={{ color: 'white', fontWeight: 600, mb: 1 }}>
                    {color.name}
                  </Text>
                  <Text variant="caption" sx={{ color: 'white', fontFamily: 'monospace' }}>
                    var({color.var})
                  </Text>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      ))}

      <Box sx={{ mt: 8 }}>
        <Text variant="h3" sx={{ mb: 3 }}>
          Usage Examples
        </Text>

        <Box sx={{
          p: 4,
          backgroundColor: 'var(--background-paper)',
          borderRadius: 2,
          border: '1px solid var(--divider)'
        }}>
          <Text variant="h5" sx={{ mb: 3, color: 'var(--p-main)' }}>
            CSS Custom Properties
          </Text>

          <Box component="pre" sx={{
            backgroundColor: 'var(--grey-900)',
            color: 'var(--grey-100)',
            p: 2,
            borderRadius: 1,
            overflow: 'auto',
            fontSize: '14px',
            fontFamily: 'monospace'
          }}>
{`/* Use in CSS */
.my-element {
  color: var(--p-main);
  background-color: var(--background-paper);
  border: 1px solid var(--divider);
}

/* Use in React/MUI sx prop */
sx={{
  color: 'var(--p-main)',
  backgroundColor: 'var(--success-light)',
  boxShadow: 'var(--shadow-primary)'
}}`}
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

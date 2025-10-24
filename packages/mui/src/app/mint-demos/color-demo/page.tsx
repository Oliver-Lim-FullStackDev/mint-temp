'use client';

import { Text } from '@mint/ui/components/typography';

import { Box, Container } from '@mui/material';

interface ColorCategory {
  title: string;
  colors: Array<{
    name: string;
    variable: string;
  }>;
}

export default function ColorDemoPage() {
  const colorCategories: ColorCategory[] = [
    {
      title: 'Global Button Colors',
      colors: [
        { name: 'Button Inherit', variable: '--button-inherit' },
        { name: 'Button Primary', variable: '--button-primary' },
        { name: 'Button Secondary', variable: '--button-secondary' },
        { name: 'Button Info', variable: '--button-info' },
        { name: 'Button Success', variable: '--button-success' },
        { name: 'Button Warning', variable: '--button-warning' },
        { name: 'Button Error', variable: '--button-error' },
        { name: 'Button Action', variable: '--button-action' },
      ],
    },
    {
      title: 'Primary Colors',
      colors: [
        { name: 'Primary 50', variable: '--primary-50' },
        { name: 'Primary 100', variable: '--primary-100' },
        { name: 'Primary 200', variable: '--primary-200' },
        { name: 'Primary 300', variable: '--primary-300' },
        { name: 'Primary 400', variable: '--primary-400' },
        { name: 'Primary 500', variable: '--primary-500' },
        { name: 'Primary 600', variable: '--primary-600' },
        { name: 'Primary 700', variable: '--primary-700' },
        { name: 'Primary 800', variable: '--primary-800' },
        { name: 'Primary 900', variable: '--primary-900' },
        { name: 'Primary 950', variable: '--primary-950' },
      ],
    },
    {
      title: 'Secondary Colors',
      colors: [
        { name: 'Secondary 50', variable: '--secondary-50' },
        { name: 'Secondary 100', variable: '--secondary-100' },
        { name: 'Secondary 200', variable: '--secondary-200' },
        { name: 'Secondary 300', variable: '--secondary-300' },
        { name: 'Secondary 400', variable: '--secondary-400' },
        { name: 'Secondary 500', variable: '--secondary-500' },
        { name: 'Secondary 600', variable: '--secondary-600' },
        { name: 'Secondary 700', variable: '--secondary-700' },
        { name: 'Secondary 800', variable: '--secondary-800' },
        { name: 'Secondary 900', variable: '--secondary-900' },
        { name: 'Secondary 950', variable: '--secondary-950' },
      ],
    },
    {
      title: 'Info Colors',
      colors: [
        { name: 'Info 50', variable: '--info-50' },
        { name: 'Info 100', variable: '--info-100' },
        { name: 'Info 200', variable: '--info-200' },
        { name: 'Info 300', variable: '--info-300' },
        { name: 'Info 400', variable: '--info-400' },
        { name: 'Info 500', variable: '--info-500' },
        { name: 'Info 600', variable: '--info-600' },
        { name: 'Info 700', variable: '--info-700' },
        { name: 'Info 800', variable: '--info-800' },
        { name: 'Info 900', variable: '--info-900' },
        { name: 'Info 950', variable: '--info-950' },
      ],
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Text variant="h3" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
        Color System Demo
      </Text>
      
      {colorCategories.map((category) => (
        <Box key={category.title} sx={{ mb: 6 }}>
          <Text variant="h4" component="h2" gutterBottom sx={{ mb: 3 }}>
            {category.title}
          </Text>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: 2,
            }}
          >
            {category.colors.map((color) => (
              <Box
                key={color.variable}
                sx={{
                  backgroundColor: `var(${color.variable})`,
                  border: '1px solid #e0e0e0',
                  borderRadius: 2,
                  p: 2,
                  minHeight: 80,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  },
                }}
                onClick={() => {
                  navigator.clipboard.writeText(color.variable);
                }}
              >
                <Text
                  variant="body2"
                  sx={{
                    fontWeight: 'bold',
                    color: 'white',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
                  }}
                >
                  {color.name}
                </Text>
                <Text
                  variant="caption"
                  sx={{
                    fontFamily: 'monospace',
                    color: 'white',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
                    fontSize: '0.75rem',
                  }}
                >
                  {color.variable}
                </Text>
              </Box>
            ))}
          </Box>
        </Box>
      ))}
    </Container>
  );
}
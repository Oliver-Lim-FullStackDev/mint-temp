'use client';

import React from 'react';
import { Text } from '@/components/core/text';
import { Box } from '@mint/ui';
import { Container } from '@mui/material';

export default function FontDemoPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 6 }}>
        <Text variant="h1" color="text-primary" sx={{ mb: 2 }}>
          Font Family Demo
        </Text>
        <Text variant="body1" color="text-secondary">
          Showcasing the new font families and fontFamily prop functionality
        </Text>
      </Box>

      {/* Typography Variants with Default Fonts */}
      <Box sx={{ mb: 8 }}>
        <Text variant="h2" color="text-primary" sx={{ mb: 4 }}>
          Typography Variants (Default Fonts)
        </Text>
        
        <Box sx={{ display: 'grid', gap: 3 }}>
          <Box>
            <Text variant="h1" color="text-primary">H1 - Mattone (900)</Text>
          </Box>
          <Box>
            <Text variant="h2" color="text-primary">H2 - Mattone (900)</Text>
          </Box>
          <Box>
            <Text variant="h3" color="text-primary">H3 - Mattone (700)</Text>
          </Box>
          <Box>
            <Text variant="h4" color="text-primary">H4 - Red Hat Display (700)</Text>
          </Box>
          <Box>
            <Text variant="h5" color="text-primary">H5 - Red Hat Display (700)</Text>
          </Box>
          <Box>
            <Text variant="h6" color="text-primary">H6 - Red Hat Display (600)</Text>
          </Box>
          <Box>
            <Text variant="subtitle1" color="text-primary">Subtitle1 - Red Hat Text (600)</Text>
          </Box>
          <Box>
            <Text variant="subtitle2" color="text-primary">Subtitle2 - Red Hat Text (600)</Text>
          </Box>
          <Box>
            <Text variant="body1" color="text-primary">Body1 - Red Hat Text (400)</Text>
          </Box>
          <Box>
            <Text variant="body2" color="text-primary">Body2 - Red Hat Text (400)</Text>
          </Box>
          <Box>
            <Text variant="caption" color="text-primary">Caption - Red Hat Mono (400)</Text>
          </Box>
          <Box>
            <Text variant="overline" color="text-primary">OVERLINE - RED HAT MONO (700)</Text>
          </Box>
        </Box>
      </Box>

      {/* FontFamily Prop Override Examples */}
      <Box sx={{ mb: 8 }}>
        <Text variant="h2" color="text-primary" sx={{ mb: 4 }}>
          FontFamily Prop Override Examples
        </Text>
        
        <Box sx={{ display: 'grid', gap: 3 }}>
          <Box>
            <Text variant="h4" fontFamily="Mattone" color="text-primary">
              H4 with Mattone Override
            </Text>
          </Box>
          <Box>
            <Text variant="body1" fontFamily="Red Hat Display" color="text-primary">
              Body1 with Red Hat Display Override
            </Text>
          </Box>
          <Box>
            <Text variant="body1" fontFamily="Red Hat Mono" color="text-primary">
              Body1 with Red Hat Mono Override
            </Text>
          </Box>
          <Box>
            <Text variant="subtitle1" fontFamily="Mattone" color="text-primary">
              Subtitle1 with Mattone Override
            </Text>
          </Box>
        </Box>
      </Box>

      {/* Font Weight Variations */}
      <Box sx={{ mb: 8 }}>
        <Text variant="h2" color="text-primary" sx={{ mb: 4 }}>
          Font Weight Variations
        </Text>
        
        <Box sx={{ display: 'grid', gap: 4 }}>
          <Box>
            <Text variant="h5" color="text-primary" sx={{ mb: 2 }}>Mattone Weights:</Text>
            <Box sx={{ display: 'grid', gap: 1 }}>
              <Text fontFamily="Mattone" sx={{ fontWeight: 400 }} color="text-primary">
                Mattone Regular (400)
              </Text>
              <Text fontFamily="Mattone" sx={{ fontWeight: 700 }} color="text-primary">
                Mattone Bold (700)
              </Text>
              <Text fontFamily="Mattone" sx={{ fontWeight: 900 }} color="text-primary">
                Mattone Black (900)
              </Text>
            </Box>
          </Box>

          <Box>
            <Text variant="h5" color="text-primary" sx={{ mb: 2 }}>Red Hat Display Weights:</Text>
            <Box sx={{ display: 'grid', gap: 1 }}>
              <Text fontFamily="Red Hat Display" sx={{ fontWeight: 400 }} color="text-primary">
                Red Hat Display Regular (400)
              </Text>
              <Text fontFamily="Red Hat Display" sx={{ fontWeight: 500 }} color="text-primary">
                Red Hat Display Medium (500)
              </Text>
              <Text fontFamily="Red Hat Display" sx={{ fontWeight: 600 }} color="text-primary">
                Red Hat Display SemiBold (600)
              </Text>
              <Text fontFamily="Red Hat Display" sx={{ fontWeight: 700 }} color="text-primary">
                Red Hat Display Bold (700)
              </Text>
              <Text fontFamily="Red Hat Display" sx={{ fontWeight: 800 }} color="text-primary">
                Red Hat Display ExtraBold (800)
              </Text>
              <Text fontFamily="Red Hat Display" sx={{ fontWeight: 900 }} color="text-primary">
                Red Hat Display Black (900)
              </Text>
            </Box>
          </Box>

          <Box>
            <Text variant="h5" color="text-primary" sx={{ mb: 2 }}>Red Hat Text Weights:</Text>
            <Box sx={{ display: 'grid', gap: 1 }}>
              <Text fontFamily="Red Hat Text" sx={{ fontWeight: 400 }} color="text-primary">
                Red Hat Text Regular (400)
              </Text>
              <Text fontFamily="Red Hat Text" sx={{ fontWeight: 500 }} color="text-primary">
                Red Hat Text Medium (500)
              </Text>
              <Text fontFamily="Red Hat Text" sx={{ fontWeight: 600 }} color="text-primary">
                Red Hat Text SemiBold (600)
              </Text>
              <Text fontFamily="Red Hat Text" sx={{ fontWeight: 700 }} color="text-primary">
                Red Hat Text Bold (700)
              </Text>
            </Box>
          </Box>

          <Box>
            <Text variant="h5" color="text-primary" sx={{ mb: 2 }}>Red Hat Mono Weights:</Text>
            <Box sx={{ display: 'grid', gap: 1 }}>
              <Text fontFamily="Red Hat Mono" sx={{ fontWeight: 400 }} color="text-primary">
                Red Hat Mono Regular (400)
              </Text>
              <Text fontFamily="Red Hat Mono" sx={{ fontWeight: 500 }} color="text-primary">
                Red Hat Mono Medium (500)
              </Text>
              <Text fontFamily="Red Hat Mono" sx={{ fontWeight: 600 }} color="text-primary">
                Red Hat Mono SemiBold (600)
              </Text>
              <Text fontFamily="Red Hat Mono" sx={{ fontWeight: 700 }} color="text-primary">
                Red Hat Mono Bold (700)
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Font Comparison */}
      <Box sx={{ mb: 8 }}>
        <Text variant="h2" color="text-primary" sx={{ mb: 4 }}>
          Font Comparison
        </Text>
        
        <Box sx={{ display: 'grid', gap: 3 }}>
          <Box>
            <Text variant="h6" color="text-secondary" sx={{ mb: 1 }}>Same text, different fonts:</Text>
            <Text fontFamily="Mattone" sx={{ fontSize: '24px', fontWeight: 700 }} color="text-primary">
              The quick brown fox jumps over the lazy dog
            </Text>
            <Text fontFamily="Red Hat Display" sx={{ fontSize: '24px', fontWeight: 700 }} color="text-primary">
              The quick brown fox jumps over the lazy dog
            </Text>
            <Text fontFamily="Red Hat Text" sx={{ fontSize: '24px', fontWeight: 700 }} color="text-primary">
              The quick brown fox jumps over the lazy dog
            </Text>
            <Text fontFamily="Red Hat Mono" sx={{ fontSize: '24px', fontWeight: 700 }} color="text-primary">
              The quick brown fox jumps over the lazy dog
            </Text>
          </Box>
        </Box>
      </Box>

      {/* Mixed Usage Example */}
      <Box sx={{ mb: 8 }}>
        <Text variant="h2" color="text-primary" sx={{ mb: 4 }}>
          Mixed Usage Example
        </Text>
        
        <Box sx={{ p: 3, border: '1px solid #333', borderRadius: 2 }}>
          <Text variant="h3" fontFamily="Mattone" color="primary-blue-main" sx={{ mb: 2 }}>
            Welcome to Our Platform
          </Text>
          <Text variant="body1" fontFamily="Red Hat Text" color="text-primary" sx={{ mb: 2 }}>
            This is a paragraph using Red Hat Text for excellent readability in body content.
          </Text>
          <Text variant="caption" fontFamily="Red Hat Mono" color="text-secondary">
            Code snippets and technical details look great in Red Hat Mono
          </Text>
        </Box>
      </Box>
    </Container>
  );
}
'use client';

import { Text } from '@/components/core';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

export default function TDemoPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Text variant="h1" sx={{ mb: 2 }}>
          H1 Heading - family/secondary, weight/900
        </Text>
        <Text variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Size: 64px (desktop) / 40px (mobile), Line Height: 80px / 50px
        </Text>

        <Text variant="h2" sx={{ mb: 2 }}>
          H2 Heading - family/secondary, weight/900
        </Text>
        <Text variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Size: 48px (desktop) / 32px (mobile), Line Height: 64px / 42.67px
        </Text>

        <Text variant="h3" sx={{ mb: 2 }}>
          H3 Heading - family/secondary, weight/700
        </Text>
        <Text variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Size: 32px (desktop) / 24px (mobile), Line Height: 48px / 36px
        </Text>

        <Text variant="h4" sx={{ mb: 2 }}>
          H4 Heading - family/primary, weight/700
        </Text>
        <Text variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Size: 24px (desktop) / 20px (mobile), Line Height: 36px / 30px
        </Text>

        <Text variant="h5" sx={{ mb: 2 }}>
          H5 Heading - family/primary, weight/700
        </Text>
        <Text variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Size: 20px (desktop) / 18px (mobile), Line Height: 30px / 27px
        </Text>

        <Text variant="h6" sx={{ mb: 2 }}>
          H6 Heading - family/primary, weight/600
        </Text>
        <Text variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Size: 18px (desktop) / 17px (mobile), Line Height: 28px / 26.64px
        </Text>

        <Text variant="subtitle1" sx={{ mb: 2 }}>
          Subtitle1 - family/primary, weight/600
        </Text>
        <Text variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Size: 16px, Line Height: 24px
        </Text>

        <Text variant="subtitle2" sx={{ mb: 2 }}>
          Subtitle2 - family/primary, weight/600
        </Text>
        <Text variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Size: 14px, Line Height: 22px
        </Text>

        <Text variant="body1" sx={{ mb: 2 }}>
          Body1 - family/primary, weight/400
        </Text>
        <Text variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Size: 16px, Line Height: 24px
        </Text>

        <Text variant="body2" sx={{ mb: 2 }}>
          Body2 - family/primary, weight/400
        </Text>
        <Text variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Size: 14px, Line Height: 22px
        </Text>

        <Text variant="body3" sx={{ mb: 2 }}>
          Body3 - family/primary, weight/400
        </Text>
        <Text variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Size: 12px, Line Height: 18px
        </Text>

        <Text variant="body4" sx={{ mb: 2 }}>
          Body4 - family/primary, weight/400
        </Text>
        <Text variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Size: 10px, Line Height: 16px
        </Text>

        <Text variant="caption" sx={{ mb: 2 }}>
          Caption - family/primary, weight/400
        </Text>
        <Text variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Size: 12px, Line Height: 18px
        </Text>

        <Text variant="overline" sx={{ mb: 2 }}>
          OVERLINE - family/primary, weight/700
        </Text>
        <Text variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Size: 12px, Line Height: 18px
        </Text>
      </Box>

      <Box sx={{ mt: 6, p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Text variant="h3" sx={{ mb: 3 }}>
          T Hierarchy Demo
        </Text>
        
        <Text variant="h1" sx={{ mb: 1 }}>
          Main Title (H1)
        </Text>
        
        <Text variant="h2" sx={{ mb: 1 }}>
          Section Title (H2)
        </Text>
        
        <Text variant="h3" sx={{ mb: 1 }}>
          Subsection Title (H3)
        </Text>
        
        <Text variant="h4" sx={{ mb: 1 }}>
          Article Title (H4)
        </Text>
        
        <Text variant="h5" sx={{ mb: 1 }}>
          Card Title (H5)
        </Text>
        
        <Text variant="h6" sx={{ mb: 2 }}>
          Component Title (H6)
        </Text>

        <Text variant="subtitle1" sx={{ mb: 1 }}>
          Subtitle 1 - Section Subtitle
        </Text>

        <Text variant="subtitle2" sx={{ mb: 2 }}>
          Subtitle 2 - Card Subtitle
        </Text>

        <Text variant="body1" sx={{ mb: 1 }}>
          Body1: This is the primary body text that demonstrates how the t hierarchy works together. 
          The headings above show the different sizes and weights available.
        </Text>

        <Text variant="body2" sx={{ mb: 1 }}>
          Body2: This is secondary body text with a smaller size for supporting content.
        </Text>

        <Text variant="body3" sx={{ mb: 1 }}>
          Body3: This is smaller body text for compact layouts and detailed information.
        </Text>

        <Text variant="body4" sx={{ mb: 2 }}>
          Body4: This is the smallest body text for fine print and minimal space requirements.
        </Text>

        <Text variant="caption" color="text.secondary" sx={{ mb: 1 }}>
          Caption: Used for image captions, form helper text, and metadata
        </Text>

        <Text variant="overline" color="text.secondary">
          OVERLINE: USED FOR LABELS AND CATEGORIES
        </Text>
      </Box>
    </Container>
  );
}
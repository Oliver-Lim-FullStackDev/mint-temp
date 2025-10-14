'use client';

import { BannerCarrousel, type CarrouselItem } from '@/components/banner-carrousel';
import { Text } from '@/components/core';
import { paths } from '@/routes/paths';
import { Box, Container } from '@mint/ui';

// Sample carousel items with placeholder images
const sampleCarrouselItems: CarrouselItem[] = [
  {
    id: '1',
    bgCover: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
    title: 'OCTOGAME',
    subtitle: 'Do you dare to play?',
    gameLink: paths.casinos.details('14098')
  },
  {
    id: '2', 
    bgCover: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    title: 'PENGWIN',
    subtitle: "Don't get rekt!",
    gameLink: paths.casinos.details('14102')
  },
  {
    id: '3',
    bgCover: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    title: 'MINTY SPINS',
    subtitle: 'Win BIG, XP, Whitelist Tickets',
    gameLink: paths.casinos.details('minty-spins')
  }
];

const singleItem: CarrouselItem[] = [
  {
    id: '1',
    bgCover: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
    title: 'SINGLE BANNER',
    subtitle: 'This banner has no pagination dots'
  }
];

export default function BannerCarrouselDemo() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Text variant="h2" color="text-primary" sx={{ mb: 2 }}>
          Banner Carrousel Demo
        </Text>
        <Text variant="body1" color="text-secondary" sx={{ mb: 4 }}>
          Interactive carousel component with background covers, dynamic descriptions, and pagination dots.
        </Text>
      </Box>

      {/* Multiple Items Carousel */}
      <Box sx={{ mb: 6 }}>
        <Text variant="h4" color="text-primary" sx={{ mb: 2 }}>
          Multiple Items (with pagination)
        </Text>
        <Text variant="body2" color="text-secondary" sx={{ mb: 3 }}>
          This carousel has multiple items and shows pagination dots. It auto-plays every 5 seconds.
        </Text>
        <BannerCarrousel 
          carrouselItems={sampleCarrouselItems}
          height="250px"
          autoPlay={true}
          autoPlayInterval={5000}
        />
      </Box>

      {/* Single Item Carousel */}
      <Box sx={{ mb: 6 }}>
        <Text variant="h4" color="text-primary" sx={{ mb: 2 }}>
          Single Item (no pagination)
        </Text>
        <Text variant="body2" color="text-secondary" sx={{ mb: 3 }}>
          This carousel has only one item, so pagination dots are hidden.
        </Text>
        <BannerCarrousel 
          carrouselItems={singleItem}
          height="200px"
          autoPlay={false}
        />
      </Box>

      {/* Different Height Example */}
      <Box sx={{ mb: 6 }}>
        <Text variant="h4" color="text-primary" sx={{ mb: 2 }}>
          Custom Height
        </Text>
        <Text variant="body2" color="text-secondary" sx={{ mb: 3 }}>
          Same carousel with a taller height (300px).
        </Text>
        <BannerCarrousel 
          carrouselItems={sampleCarrouselItems}
          height="300px"
          autoPlay={true}
          autoPlayInterval={3000}
        />
      </Box>

      {/* Features List */}
      <Box sx={{ mt: 6, p: 3, backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: 2 }}>
        <Text variant="h5" color="text-primary" sx={{ mb: 2 }}>
          Component Features
        </Text>
        <Box component="ul" sx={{ pl: 2 }}>
          <Box component="li" sx={{ mb: 1 }}>
            <Text variant="body2" color="text-secondary">
              ✅ Background cover images with proper sizing and positioning
            </Text>
          </Box>
          <Box component="li" sx={{ mb: 1 }}>
            <Text variant="body2" color="text-secondary">
              ✅ Dynamic subtitle and title display (subtitle first) with text shadows for readability
            </Text>
          </Box>
          <Box component="li" sx={{ mb: 1 }}>
            <Text variant="body2" color="text-secondary">
              ✅ Pagination dots positioned at top-left that only appear when there are multiple items
            </Text>
          </Box>
          <Box component="li" sx={{ mb: 1 }}>
            <Text variant="body2" color="text-secondary">
              ✅ Auto-play functionality with customizable intervals
            </Text>
          </Box>
          <Box component="li" sx={{ mb: 1 }}>
            <Text variant="body2" color="text-secondary">
              ✅ Clickable pagination dots for manual navigation
            </Text>
          </Box>
          <Box component="li" sx={{ mb: 1 }}>
            <Text variant="body2" color="text-secondary">
              ✅ Optional onClick handlers for carousel items
            </Text>
          </Box>
          <Box component="li" sx={{ mb: 1 }}>
            <Text variant="body2" color="text-secondary">
              ✅ Responsive design with customizable height
            </Text>
          </Box>
          <Box component="li" sx={{ mb: 1 }}>
            <Text variant="body2" color="text-secondary">
              ✅ Uses colors from colors.css and Text component
            </Text>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
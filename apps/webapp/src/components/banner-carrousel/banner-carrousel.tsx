import type { EmblaPluginType } from 'embla-carousel';
import Autoplay from 'embla-carousel-autoplay';
import Fade from 'embla-carousel-fade';
import Link from 'next/link';

import { Text } from '@/components/core';
import { Box } from '@mint/ui';
import { Carousel, CarouselDotButtons, useCarousel } from '@mint/ui/components/carousel';
import React from 'react';

export interface CarrouselItem {
  id: string;
  bgCover: string;
  title: string;
  subtitle: string;
  gameLink?: string;
}

export interface BannerCarrouselProps {
  carrouselItems: CarrouselItem[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  height?: string | number;
}

// Carousel slide component
const CarouselSlideItem: React.FC<{ item: CarrouselItem; height: string | number }> = ({ item, height }) => {
  const content = (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height,
        backgroundImage: `url(${item.bgCover})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        alignItems: 'flex-end',
        padding: '24px',
        cursor: item.gameLink ? 'pointer' : 'default',
        borderRadius: 'var(--card-radius, 16px)',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.7) 100%)',
          zIndex: 1,
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}
      >
        <Text variant="body2" fontFamily='Red Hat Text' sx={{ color: 'var(--secondary-main)', opacity: 0.8 }}>
          {item.subtitle}
        </Text>
        <Text variant="h5" fontFamily='Mattone' sx={{ color: 'var(--primary-contrast-text)', fontWeight: 'bold', fontSize: '32px !important' }}>
          {item.title}
        </Text>
      </Box>
    </Box>
  );

  if (item.gameLink) {
    return (
      <Link href={item.gameLink} style={{ textDecoration: 'none', display: 'block' }}>
        {content}
      </Link>
    );
  }

  return content;
};

export const BannerCarrousel: React.FC<BannerCarrouselProps> = ({
  carrouselItems,
  autoPlay = true,
  autoPlayInterval = 5000,
  height = '200px',
}) => {
  // Setup Embla Carousel with fade effect and autoplay
  const plugins: EmblaPluginType[] = [];
  
  // Add fade plugin
  plugins.push(Fade());
  
  // Add autoplay plugin if enabled
  if (autoPlay && carrouselItems.length > 1) {
    plugins.push(Autoplay({ delay: autoPlayInterval, stopOnInteraction: false }));
  }

  const carousel = useCarousel(
    {
      loop: carrouselItems.length > 1,
      duration: 50, // Faster transition for fade effect
    },
    plugins
  );

  const showPagination = carrouselItems.length > 1;

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height,
        borderRadius: 'var(--card-radius, 16px)',
        overflow: 'hidden',
        backgroundColor: 'var(--grey-800)',
        boxShadow: `0 4px 24px 0 color(display-p3 1 1 1 / 0.08) inset, 0 1px 1px 0 color(display-p3 0.0886 1 0.8937 / 0.25) inset, 0 -1px 1px 0 color(display-p3 0 0 0 / 0.25) inset, var(--card-x1, 0) var(--card-y1, 0) var(--card-blur1, 2px) var(--card-spread1, 0) var(--shadow-20, color(display-p3 0 0 0 / 0.20)), var(--card-x2, 0) var(--card-y2, 12px) var(--card-blur2, 24px) var(--card-spread2, -4px) var(--shadow-12, color(display-p3 0 0 0 / 0.12))`,
        backdropFilter: 'blur(4px)',
        mt: 2
      }}
    >
      <Carousel carousel={carousel}>
        {carrouselItems.map((item) => (
          <CarouselSlideItem key={item.id} item={item} height={height} />
        ))}
      </Carousel>

      {showPagination && (
        <CarouselDotButtons
          scrollSnaps={carousel.dots.scrollSnaps}
          selectedIndex={carousel.dots.selectedIndex}
          onClickDot={carousel.dots.onClickDot}
          variant="circular"
          sx={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            zIndex: 3,
            '& .carousel__dot__item': {
              width: '8px',
              height: '8px',
              '&::before': {
                backgroundColor: 'rgba(255, 255, 255, 0.4)',
              },
              '&.carousel__dot__selected::before': {
                backgroundColor: 'var(--p-light)',
              },
              '&:hover::before': {
                backgroundColor: 'rgba(255, 255, 255, 0.6)',
              },
              '&.carousel__dot__selected:hover::before': {
                backgroundColor: 'var(--p-light)',
              },
            },
          }}
        />
      )}
    </Box>
  );
};

export default BannerCarrousel;
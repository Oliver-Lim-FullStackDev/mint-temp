'use client';

import type { EmblaPluginType } from 'embla-carousel';

import React from 'react';
import Link from 'next/link';
import Fade from 'embla-carousel-fade';
import Autoplay from 'embla-carousel-autoplay';
import { Carousel, useCarousel, CarouselDotButtons } from '../carousel';

import { Box } from '../core';
import { Text } from '../typography';

export interface CarrouselItem {
  id: string;
  bgCover?: string;
  videoUrl?: string;
  title?: string;
  subtitle?: string;
  tags?: { id: string; tag: string }[];
  gameLink?: {
    label: string | null;
    url: string | null;
  };
}

export interface BannerCarrouselProps {
  carrouselItems: CarrouselItem[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  height?: string | number;
}

// Carousel slide component
const CarouselSlideItem: React.FC<{ item: CarrouselItem; height: string | number }> = ({
  item,
  height,
}) => (
  <Box
    sx={{
      position: 'relative',
      width: '100%',
      height,
      borderRadius: 'var(--card-radius, 16px)',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
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
    {item.videoUrl ? (
      <video
        src={item.videoUrl}
        autoPlay
        muted
        loop
        playsInline
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      />
    ) : item.bgCover ? (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          backgroundImage: `url(${item.bgCover})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      />
    ) : null}

    <Box
      sx={{
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: '8px',
        padding: '24px',
        width: '100%',
      }}
    >
      {/* Title */}
      {item.title && (
        <Text
          variant="h5"
          fontFamily="Mattone"
          sx={{
            color: 'var(--primary-contrast-text)',
            fontWeight: 'bold',
            fontSize: '32px !important',
          }}
        >
          {item.title}
        </Text>
      )}

      {/* Subtitle */}
      {item.subtitle && (
        <Text
          variant="body2"
          fontFamily="Red Hat Text"
          sx={{ color: 'var(--secondary-main)', opacity: 0.8 }}
        >
          {item.subtitle}
        </Text>
      )}

      {/* Button */}
      {item.gameLink?.url && item.gameLink?.label && (
        <Link
          href={item.gameLink.url}
          target="_blank"
          style={{ textDecoration: 'none', display: 'inline-block' }}
        >
          <Box
            component="button"
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontFamily: 'Red Hat Text',
              transition: 'background 0.2s ease, border 0.2s ease',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderColor: 'rgba(255, 255, 255, 0.5)',
              },
            }}
          >
            {item.gameLink.label}
          </Box>
        </Link>
      )}
    </Box>
  </Box>
);

export const BannerCarrousel: React.FC<BannerCarrouselProps> = ({
  carrouselItems,
  autoPlay = true,
  autoPlayInterval = 5000,
  height = '360px',
}) => {
  const plugins: EmblaPluginType[] = [Fade()];

  if (autoPlay && carrouselItems.length > 1) {
    plugins.push(Autoplay({ delay: autoPlayInterval, stopOnInteraction: false }));
  }

  const carousel = useCarousel(
    {
      loop: carrouselItems.length > 1,
      duration: 50,
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
        boxShadow: `0 4px 24px 0 color(display-p3 1 1 1 / 0.08) inset,
                    0 1px 1px 0 color(display-p3 0.0886 1 0.8937 / 0.25) inset,
                    0 -1px 1px 0 color(display-p3 0 0 0 / 0.25) inset,
                    var(--card-x1, 0) var(--card-y1, 0)
                    var(--card-blur1, 2px) var(--card-spread1, 0)
                    var(--shadow-20, color(display-p3 0 0 0 / 0.20)),
                    var(--card-x2, 0) var(--card-y2, 12px)
                    var(--card-blur2, 24px) var(--card-spread2, -4px)
                    var(--shadow-12, color(display-p3 0 0 0 / 0.12))`,
        backdropFilter: 'blur(4px)',
        mt: 2,
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

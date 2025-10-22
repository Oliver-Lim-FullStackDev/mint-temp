import type { Metadata } from 'next';
import React from 'react';
import { HomeView } from './view';
import { BannerCarrousel } from '@mint/ui/components';
import { apiFetch } from '@mint/client';

export const metadata: Metadata = {
  title: 'Mint.io | Get Minted',
  description: '...',
};

export default async function Page() {
  const banners = await apiFetch('/cms/banners');

  // Transform banners data to carrousel items
  const carrouselItems = banners.flatMap((b: any) => {
    if (b.type === 'carousel') {
      // Every slide inside the carousel
      return b.carousel.map((slide: any) => ({
        id: slide.id,
        bgCover:
          slide.slideImage?.url ||
          slide.slideVideo?.url ||
          '/images/default-banner.jpg',
        title: slide.title,
        subtitle: slide.subtitle,
        gameLink: slide.actionButton?.url,
        tags: slide.tags || [],
      }));
    } else {
      // Banners imagen/video simples
      return {
        id: b.id,
        bgCover: b.image?.url || b.video?.url || '/images/default-banner.jpg',
        title: b.title,
        subtitle: b.subtitle,
        gameLink: b.actionButton?.url,
        tags: b.tags || [],
      };
    }
  });

  return (
    <>
      <BannerCarrousel carrouselItems={carrouselItems} height={480} />
      <HomeView />
    </>
  );
}

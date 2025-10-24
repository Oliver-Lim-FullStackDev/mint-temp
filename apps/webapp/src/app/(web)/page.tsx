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
  const baseUrl = process.env.NEXT_PUBLIC_PAYLOAD_URL!;

  // Fetch de banners
  const banners = await apiFetch('/cms/banners');

  // Transform banners to carrousel items
  const carrouselItems = banners.flatMap((b: any) => {
    if (b.type === 'carousel' && Array.isArray(b.carousel)) {
      return b.carousel.map((slide: any) => ({
        id: slide.id,
        bgCover: slide.slideImage?.url
          ? `${baseUrl}${slide.slideImage.url}`
          : undefined,
        videoUrl: slide.slideVideo?.url
          ? `${baseUrl}${slide.slideVideo.url}`
          : undefined,
        title: slide.title,
        subtitle: slide.subtitle,
        tags: slide.tags || [],
        gameLink: slide.actionButton
          ? { label: slide.actionButton.label, url: slide.actionButton.url }
          : null,
      }));
    } else {
      return {
        id: b.id,
        bgCover: b.image?.url ? `${baseUrl}${b.image.url}` : undefined,
        videoUrl: b.video?.url ? `${baseUrl}${b.video.url}` : undefined,
        title: b.title,
        subtitle: b.subtitle,
        tags: b.tags || [],
        gameLink: b.actionButton
          ? { label: b.actionButton.label, url: b.actionButton.url }
          : null,
      };
    }
  });

  return (
    <>
      <BannerCarrousel
        carrouselItems={carrouselItems}
        height={360}
        autoPlay={true}
        autoPlayInterval={5000}
      />
      <HomeView />
    </>
  );
}

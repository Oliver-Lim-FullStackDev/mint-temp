import { Injectable } from '@nestjs/common';
import { PayloadClient } from '../clients/payload.client';
import { BannerDto, BannerTagDto, BannerActionButtonDto, BannerMediaDto } from '../dto/banner.dto';
import { PayloadBanner, PayloadBannerResponse } from '../dto/payload-banner-response.dto';

@Injectable()
export class CmsService {
  constructor(private readonly payload: PayloadClient) {}

  /**
   * Retrieves all banners from the CMS
   */
  async getBanners(): Promise<BannerDto[]> {
    const data = await this.payload.get<PayloadBannerResponse>('banners');
    return this.mapToBannerFormat(data.docs);
  }

  /**
   * Maps raw Payload banner data to BannerDto
   */
  private mapToBannerFormat(rawBanners: PayloadBanner[]): BannerDto[] {
    return rawBanners.map((banner) => ({
      id: String(banner.id),
      title: banner.title ?? 'Untitled',
      subtitle: banner.subtitle,
      section: banner.section,
      type: banner.type,
      published: banner.published ?? false,
      createdAt: banner.createdAt,
      updatedAt: banner.updatedAt,
      background: banner.background ?? null,

      // Main media fields for standard banners (image / video)
      image: banner.image ? this.mapMedia(banner.image) : null,
      video: banner.video ? this.mapMedia(banner.video) : null,

      // Carousel slides (if type = 'carousel')
      carousel:
        banner.carousel?.map((slide) => ({
          id: slide.id,
          title: slide.title,
          subtitle: slide.subtitle,
          slideType: slide.slideType,
          slideImage: slide.slideImage ? this.mapMedia(slide.slideImage) : null,
          slideVideo: slide.slideVideo ? this.mapMedia(slide.slideVideo) : null,
          tags: slide.tags?.map((tag) => ({ id: tag.id, tag: tag.tag })) ?? [],
          actionButton: slide.actionButton
            ? { label: slide.actionButton.label, url: slide.actionButton.url }
            : undefined,
        })) ?? [],

      // Tags and call-to-action button at root level
      tags: banner.tags?.map((tag) => ({ id: tag.id, tag: tag.tag })) as BannerTagDto[],
      actionButton: banner.actionButton
        ? ({ label: banner.actionButton.label, url: banner.actionButton.url } as BannerActionButtonDto)
        : undefined,
    }));
  }

  /**
   * Maps media objects (image or video) from Payload to internal DTO
   */
  private mapMedia(media: any): BannerMediaDto {
    return {
      id: media.id,
      alt: media.alt,
      url: media.url,
      filename: media.filename,
      mimeType: media.mimeType,
      width: media.width,
      height: media.height,
    };
  }
}

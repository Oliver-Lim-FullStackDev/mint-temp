import { Injectable } from '@nestjs/common';
import { PayloadClient } from '../clients/payload.client';
import { BannerDto, BannerTagDto, BannerActionButtonDto } from '../dto/banner.dto';
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
      tags: banner.tags?.map((tag) => ({ id: tag.id, tag: tag.tag }) as BannerTagDto),
      actionButton: banner.actionButton
        ? ({ label: banner.actionButton.label, url: banner.actionButton.url } as BannerActionButtonDto)
        : undefined,
      background: banner.background ?? null,
      section: banner.section,
      type: banner.type,
      published: banner.published ?? false,
      createdAt: banner.createdAt,
      updatedAt: banner.updatedAt,
    }));
  }
}

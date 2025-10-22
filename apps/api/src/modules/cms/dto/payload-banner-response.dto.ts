export interface PayloadBannerTag {
  id: string;
  tag: string;
}

export interface PayloadBannerActionButton {
  label: string;
  url: string;
}

export interface PayloadMedia {
  id: number;
  alt?: string;
  url: string;
  filename?: string;
  mimeType?: string;
  width?: number;
  height?: number;
}

export interface PayloadCarouselSlide {
  id: string;
  title: string;
  subtitle?: string;
  slideType: 'image' | 'video';
  slideImage?: PayloadMedia | null;
  slideVideo?: PayloadMedia | null;
  tags?: PayloadBannerTag[];
  actionButton?: PayloadBannerActionButton;
}

export interface PayloadBanner {
  id: number | string;
  title: string;
  subtitle?: string;
  section?: string;
  type?: 'image' | 'video' | 'carousel';
  published?: boolean;
  createdAt: string;
  updatedAt: string;
  image?: PayloadMedia | null;
  video?: PayloadMedia | null;
  carousel?: PayloadCarouselSlide[];
  tags?: PayloadBannerTag[];
  actionButton?: PayloadBannerActionButton;
  background?: string | null;
}

export interface PayloadBannerResponse {
  docs: PayloadBanner[];
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
  nextPage: number | null;
  page: number;
  pagingCounter: number;
  prevPage: number | null;
  totalDocs: number;
  totalPages: number;
}

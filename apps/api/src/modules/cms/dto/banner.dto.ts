export interface BannerTagDto {
  id: string;
  tag: string;
}

export interface BannerActionButtonDto {
  label: string;
  url: string;
}

export interface BannerMediaDto {
  id: number;
  alt?: string;
  url: string;
  filename?: string;
  mimeType?: string;
  width?: number;
  height?: number;
}

export interface BannerCarouselSlideDto {
  id: string;
  title: string;
  subtitle?: string;
  slideType: 'image' | 'video';
  slideImage?: BannerMediaDto | null;
  slideVideo?: BannerMediaDto | null;
  tags?: BannerTagDto[];
  actionButton?: BannerActionButtonDto;
}

export interface BannerDto {
  id: string;
  title: string;
  subtitle?: string;
  section?: string;
  type?: 'image' | 'video' | 'carousel';
  published?: boolean;
  createdAt: string;
  updatedAt: string;
  image?: BannerMediaDto | null;
  video?: BannerMediaDto | null;
  carousel?: BannerCarouselSlideDto[];
  tags?: BannerTagDto[];
  actionButton?: BannerActionButtonDto;
  background?: string | null;
}

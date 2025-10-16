export interface BannerTagDto {
  id: string;
  tag: string;
}

export interface BannerActionButtonDto {
  label: string;
  url: string;
}

export interface BannerDto {
  id: string;
  title: string;
  subtitle?: string;
  tags?: BannerTagDto[];
  actionButton?: BannerActionButtonDto;
  background?: string | null;
  section?: string;
  type?: string;
  published?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PayloadBannerTag {
  id: string;
  tag: string;
}

export interface PayloadBannerActionButton {
  label: string;
  url: string;
}

export interface PayloadBanner {
  id: number | string;
  title: string;
  subtitle?: string;
  tags?: PayloadBannerTag[];
  actionButton?: PayloadBannerActionButton;
  background?: string | null;
  section?: string;
  type?: string;
  published?: boolean;
  createdAt: string;
  updatedAt: string;
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

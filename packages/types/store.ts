export interface StorePrice {
  [key: string]: number;
}

export interface PriceResponse {
  price: {
    ton: number;
    usd: number;
    stars: number;
  };
}

export interface StoreItem {
  id: string;
  title: string;
  description: string;
  price: StorePrice;
  imageUrl?: string;
  available: boolean;
}
// TODO move type to types package for both API and webapp
export type GameCategory = {
  id?: string;
  slug?: string;
  name?: string;
};

export type Game = {
  id: string;
  slug: string;
  displayProvider?: string;
  providerSlug?: string;
  backgroundUrl?: string;
  backgroundOverlayUrl?: string;
  backgroundOverlayImageAlignment?: string;
  jackpotValue?: number;
  jackpotCurrency?: string;
  imageUrl: string;
  provider?: string;
  title?: string;
  titleUrl?: string;
  tags?: string[];
  categories?: GameCategory[];
};

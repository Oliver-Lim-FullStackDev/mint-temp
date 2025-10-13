// TODO move type to types package for both API and webapp
export type Game = {
  id: string;
  displayProvider?: string;
  backgroundUrl?: string;
  backgroundOverlayUrl?: string;
  backgroundOverlayImageAlignment?: string;
  jackpotValue?: number;
  jackpotCurrency?: string;
  imageUrl: string;
  slug: string;
  provider?: string;
  title?: string;
  titleUrl?: string;
};

// TODO move type to types package for both API and webapp
export interface GameCategory {
  id?: string;
  slug: string;
  name?: string;
}

export interface Game {
  id: string;
  title: string;
  slug?: string;
  provider: string;
  providerSlug?: string;
  displayProvider: string;
  imageUrl: string;
  titleUrl: string;
  categories?: GameCategory[];
  tags?: string[];

  // rtp: string;
  // hideRtp: boolean;
  // volatility: string;
  // minBetCents: number;
  // maxBetCents: number;
  // biggestWinCents: string;
}

export interface RawGame {
  id: string;
  title: string;
  slug?: string;
  provider: string;
  providerSlug?: string;
  providerName?: string;
  displayProvider?: string;
  imageUrl: string;
  titleUrl: string;
  categories?: { id?: string; slug?: string; name?: string; tag?: string; title?: string }[];
  tags?: (string | { id?: string; slug?: string; tag?: string })[];

  // seoName: string;
  // rtp: string; // i.e. "96.16%"
  // hideRtp: boolean;
  // volatility: string; // i.e. "Medium"
  // minBetCents: number; // i.e. 100
  // maxBetCents: number; // i.e. 200000
  // biggestWinCents: string; // i.e. "160000000";
}

export type HeroGameSearchBucket = RawGame[] | { data: RawGame[] };

export interface GameSearchResponse {
  result: Record<string, HeroGameSearchBucket>;
}

export interface RawGameProvider {
  id?: string;
  slug?: string;
  tag?: string;
  name?: string;
  displayName?: string;
  title?: string;
}

export interface GameProvider {
  id: string;
  slug: string;
  name: string;
  displayName: string;
}

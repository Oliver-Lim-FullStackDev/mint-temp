export type GameCategory = {
  id?: string;
  slug?: string;
  name?: string;
};

export interface Game {
  id: string;
  title?: string;
  slug?: string;
  provider?: string;
  providerSlug?: string;
  displayProvider?: string;
  imageUrl: string;
  titleUrl?: string;
  categories?: GameCategory[];
  tags?: string[];
  backgroundUrl?: string;
  backgroundOverlayUrl?: string;
  backgroundOverlayImageAlignment?: string;
  jackpotValue?: number;
  jackpotCurrency?: string;
}

export interface RawGame extends Omit<Game, 'categories' | 'tags'> {
  title: string;
  provider: string;
  displayProvider?: string;
  titleUrl: string;
  providerName?: string;
  categories?: RawGameCategory[];
  tags?: RawGameTag[];
}

export type RawGameCategory = GameCategory & {
  tag?: string;
  title?: string;
};

export type RawGameTag = string | { id?: string; slug?: string; tag?: string };

export interface GameProvider {
  id: string;
  slug: string;
  name: string;
  displayName: string;
}

export interface RawGameProviderDetails {
  id?: string;
  slug?: string;
  tag?: string;
  name?: string;
  displayName?: string;
  title?: string;
}

export type RawGameProviderValue = NonNullable<
  | RawGameProviderDetails['id']
  | RawGameProviderDetails['slug']
  | RawGameProviderDetails['tag']
  | RawGameProviderDetails['name']
  | RawGameProviderDetails['displayName']
  | RawGameProviderDetails['title']
>;

export type RawGameProvider = RawGameProviderValue | RawGameProviderDetails;

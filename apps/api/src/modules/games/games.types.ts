// TODO move type to types package for both API and webapp
export interface Game {
  id: string;
  title: string;
  provider: string;
  displayProvider: string;
  imageUrl: string;
  titleUrl: string;

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
  provider: string;
  displayProvider?: string;
  imageUrl: string;
  titleUrl: string;

  // seoName: string;
  // rtp: string; // i.e. "96.16%"
  // hideRtp: boolean;
  // volatility: string; // i.e. "Medium"
  // minBetCents: number; // i.e. 100
  // maxBetCents: number; // i.e. 200000
  // biggestWinCents: string; // i.e. "160000000";
}

export interface GameSearchResponse {
  result: {
    data: RawGame[];
  };
}

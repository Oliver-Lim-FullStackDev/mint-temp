import { Game, RawGame } from './games.types';

export const GameMapper = {
  fromApi(raw: RawGame): Game {
    return {
      id: raw.id,
      title: raw.title,
      provider: raw.provider,
      displayProvider: raw.displayProvider ?? raw.provider,
      imageUrl: raw.imageUrl,
      titleUrl: raw.titleUrl,
    };
  },
};

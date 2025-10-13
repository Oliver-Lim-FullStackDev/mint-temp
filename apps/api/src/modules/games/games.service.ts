import { Injectable } from '@nestjs/common';
import { HeroGamingApiRoutes } from 'src/shared/hero-gaming-api-routes';
import { HeroGamingClient } from 'src/shared/hero-gaming.client';
import { GameMapper } from './games.mapper';
import { Game, GameSearchResponse, RawGame } from './games.types';

@Injectable()
export class GamesService {
  constructor(private readonly hg: HeroGamingClient) {}

  private transform(game: RawGame): Game {
    return GameMapper.fromApi(game);
  }

  private getMintStaticGames(params: { id?: string; provider?: string }): Game | Game[] | undefined {
    if (!params.id && !params.provider) return;

    const mintGames = [
      {
        id: 'minty-spins',
        title: 'Minty Spins',
        provider: 'mint',
        displayProvider: 'Mint',
        imageUrl: `/assets/games/minty-spins/thumbnail.png`,
        titleUrl: '',
      },
    ];

    if (params.id) {
      const game = mintGames.filter((game: Game) => game.id === params.id)?.[0];

      return game ? this.transform(game) : undefined;
    }

    return mintGames.filter((game) => game.provider === params.provider).map((game: Game) => this.transform(game));
  }

  async findOne(id: string): Promise<Game> {
    // Mint Games (Daily Plays) - Static for now
    if (id?.includes('mint')) {
      const game = this.getMintStaticGames({ id }) as Game;
      if (game) {
        return this.transform(game);
      }
    }

    const game = await this.hg.v3.get<RawGame>(HeroGamingApiRoutes.gameById(id));

    return this.transform(game);
  }

  async findAll(): Promise<Game[]> {
    const games = await this.hg.get<RawGame[]>(`/games`);
    return games.map((g) => this.transform(g));
  }

  async search(params: { tags?: string[]; limit?: number }): Promise<Game[]> {
    // Mint Games (Daily Plays) - Static for now
    const mintDailyGames: Game[] = [];
    if (params.tags?.includes('mint')) {
      const games = this.getMintStaticGames({ provider: 'mint' }) as Game[];
      if (games) {
        mintDailyGames.push(...games);
      }

      // clean tags or Hero wont find anything with mint-daily
      params.tags.splice(params.tags.indexOf('mint'), 1);
    }

    // Normalise tags ['yolted', 'tinyrex', ...], query for Herogaming
    let query = { ...params };
    if (params.tags?.length) {
      // we send to Hero
      // {
      //   "originals": { "tags": ["originals"], limit: 123, ... },
      //   "tinyrex": { "tags": ["tinyrex"], limit: 123, ... }
      // }
      query = Object.fromEntries(
        params.tags.map(tag => [tag, { ...params, tags: [tag] }])
      );
    }

    const response = await this.hg.v2.post<GameSearchResponse>(HeroGamingApiRoutes.gamesSearch, {
      q: query,
    });

    if (!response) {
      throw new Error('Unexpected response from HeroGaming API');
    }

    const heroGames = Object.values(response.result).flat();

    // Merge Mint and Hero games
    return [...heroGames, ...mintDailyGames].map((g) => this.transform(g));
  }
}

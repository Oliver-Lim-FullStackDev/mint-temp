import { Injectable } from '@nestjs/common';
import { HeroGamingApiRoutes } from 'src/shared/hero-gaming-api-routes';
import { HeroGamingClient } from 'src/shared/hero-gaming.client';
import { GameMapper } from './games.mapper';
import { Game, RawGame } from './games.types';

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

  async search(params: {
    tags?: string[];
    limit?: number;
    offset?: number;
    search?: string;
    order?: 'ASC' | 'DESC';
    provider?: string;
    providers?: string[];
  }): Promise<Game[]> {
    const {
      tags = [],
      limit = 9999,
      offset = 0,
      search,
      order = 'ASC',
      provider,
      providers = [],
    } = params;

    const effectiveTags = [...tags];

    // Mint Games (Daily Plays) - Static for now
    const mintDailyGames: Game[] = [];
    if (effectiveTags.includes('mint')) {
      const games = this.getMintStaticGames({ provider: 'mint' }) as Game[];
      if (games) {
        mintDailyGames.push(...games);
      }

      // Remove mint tag before applying Hub88 filters
      effectiveTags.splice(effectiveTags.indexOf('mint'), 1);
    }

    const rawGames = await this.hg.get<RawGame[]>(`/games`);
    let heroGames = rawGames.map((g) => this.transform(g));

    if (effectiveTags.length) {
      heroGames = heroGames.filter((game) => {
        const tagSet = new Set([
          ...(game.tags ?? []),
          ...(game.categories?.map((category) => category.slug) ?? []),
        ]);

        if (!tagSet.size) {
          return false;
        }

        return effectiveTags.some((tag) => tagSet.has(tag));
      });
    }

    const providerFilters = providers.length
      ? providers
      : provider
        ? [provider]
        : [];

    const normalizedProviders = providerFilters.map((value) => value.toLowerCase());

    if (providerFilters.length) {
      heroGames = heroGames.filter((game) => {
        const providerValues = [
          game.provider?.toLowerCase(),
          game.providerSlug?.toLowerCase(),
          game.displayProvider?.toLowerCase(),
        ].filter(Boolean) as string[];

        return providerValues.some((value) => normalizedProviders.includes(value));
      });
    }

    const filterBySearch = (game: Game) => {
      if (!search) {
        return true;
      }

      const term = search.toLowerCase();
      const searchable = [
        game.title,
        game.provider,
        game.displayProvider,
        ...(game.tags ?? []),
        ...(game.categories?.map((category) => category.name ?? category.slug) ?? []),
      ]
        .filter(Boolean)
        .map((value) => value!.toString().toLowerCase());

      return searchable.some((value) => value.includes(term));
    };

    heroGames = heroGames.filter(filterBySearch);
    let filteredMintDaily = mintDailyGames.filter(filterBySearch);

    if (providerFilters.length) {
      filteredMintDaily = filteredMintDaily.filter((game) => {
        const providerValues = [
          game.provider?.toLowerCase(),
          game.providerSlug?.toLowerCase(),
          game.displayProvider?.toLowerCase(),
        ].filter(Boolean) as string[];

        return providerValues.some((value) => normalizedProviders.includes(value));
      });
    }

    heroGames.sort((a, b) => {
      const aTitle = a.title?.toLowerCase() ?? '';
      const bTitle = b.title?.toLowerCase() ?? '';
      return aTitle.localeCompare(bTitle);
    });

    if (order === 'DESC') {
      heroGames.reverse();
    }

    const combined = [...heroGames, ...filteredMintDaily];

    const start = Math.max(offset, 0);
    const end = limit ? start + limit : combined.length;

    return combined.slice(start, end);
  }
}

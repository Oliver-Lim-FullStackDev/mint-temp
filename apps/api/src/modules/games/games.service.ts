import { Injectable } from '@nestjs/common';
import { HeroGamingApiRoutes } from 'src/shared/hero-gaming-api-routes';
import { HeroGamingClient } from 'src/shared/hero-gaming.client';
import { GameMapper } from './games.mapper';
import { HeroGamesTransformer } from './hero-games.transformer';
import { Game, GameProvider, GameSearchResponse, RawGame, RawGameProvider } from './games.types';

@Injectable()
export class GamesService {
  constructor(private readonly hg: HeroGamingClient) {}

  private transform(game: RawGame): Game {
    return GameMapper.fromApi(game);
  }

  private getMintStaticGames(params: { id?: string; provider?: string }): RawGame | RawGame[] | undefined {
    if (!params.id && !params.provider) return;

    const mintGames: RawGame[] = [
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
      const game = mintGames.find((game) => game.id === params.id);

      return game ?? undefined;
    }

    return mintGames.filter((game) => game.provider === params.provider);
  }

  async findOne(id: string): Promise<Game> {
    // Mint Games (Daily Plays) - Static for now
    if (id?.includes('mint')) {
      const game = this.getMintStaticGames({ id }) as RawGame;
      if (game) {
        return this.transform(game);
      }
    }

    const game = await this.hg.v3.get<RawGame>(HeroGamingApiRoutes.gameById(id));

    return this.transform(game);
  }

  async findAll(): Promise<Game[]> {
    const order = HeroGamesTransformer.normaliseOrder('');

    const response = await this.hg.v2.post<GameSearchResponse>(HeroGamingApiRoutes.gamesSearch, {
      q: {
        results: HeroGamesTransformer.buildSearchBucket({
          limit: 999,
          order,
          tags: [],
        }),
      },
    });

    const rawGames = HeroGamesTransformer.extractGamesFromBucket(response?.result?.results);

    return rawGames.map((game) => this.transform(game));
  }

  async findProviders(): Promise<GameProvider[]> {
    const providers = await this.hg.v1.get<RawGameProvider[]>(`/game_providers`);

    return HeroGamesTransformer.mapProviders(providers);
  }

  async search(params: {
    tags?: string[];
    limit?: number;
    offset?: number;
    search?: string;
    order?: '' | 'ASC' | 'DESC';
    provider?: string;
    providers?: string[];
  }): Promise<Game[]> {
    const {
      tags = [],
      limit = 9999,
      offset = 0,
      search,
      order = '',
      provider,
      providers = [],
    } = params;

    const effectiveTags = [...new Set(tags.map((tag) => tag.toLowerCase()))];

    const providerFilters = providers.length ? providers : provider ? [provider] : [];
    const normalizedProviders = providerFilters
      .map((value) => value?.toString().trim().toLowerCase())
      .filter((value): value is string => Boolean(value?.length));

    const includeMintDaily = effectiveTags.includes('mint') || normalizedProviders.includes('mint');

    if (includeMintDaily && effectiveTags.includes('mint')) {
      effectiveTags.splice(effectiveTags.indexOf('mint'), 1);
    }

    const heroTags = effectiveTags.filter((tag) => tag !== 'mint');
    const heroProviders = HeroGamesTransformer.normaliseSearchProviders(providerFilters);

    const limitForRequest = limit ?? 999;
    const heroLimit = Math.max(offset ? limitForRequest + offset : limitForRequest, 1);
    const heroOrder = HeroGamesTransformer.normaliseOrder(order);
    const baseBucket = HeroGamesTransformer.buildSearchBucket({
      limit: heroLimit,
      order: heroOrder,
      tags: heroTags,
      text: search,
      providers: heroProviders,
    });

    const queryBuckets = HeroGamesTransformer.buildQueryBuckets(baseBucket, heroProviders);

    const response = await this.hg.v2.post<GameSearchResponse>(HeroGamingApiRoutes.gamesSearch, {
      q: queryBuckets,
    });

    const bucketsToRead = heroProviders.length ? ['search'] : ['results'];

    const rawHeroGames = HeroGamesTransformer.extractGamesFromResponse(response, bucketsToRead);

    const seenHeroGameIds = new Set<string>();
    const heroGamesInOrder: Game[] = [];

    rawHeroGames.forEach((rawGame) => {
      const mapped = this.transform(rawGame);
      if (seenHeroGameIds.has(mapped.id)) {
        return;
      }

      seenHeroGameIds.add(mapped.id);
      heroGamesInOrder.push(mapped);
    });

    let heroGames = heroGamesInOrder;

    if (normalizedProviders.length) {
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

    let filteredMintDaily: Game[] = [];

    if (includeMintDaily) {
      const mintGames = this.getMintStaticGames({ provider: 'mint' });
      if (Array.isArray(mintGames)) {
        filteredMintDaily = mintGames
          .map((game) => this.transform(game))
          .filter(filterBySearch)
          .filter((game) => {
            if (!normalizedProviders.length) {
              return true;
            }

            const providerValues = [
              game.provider?.toLowerCase(),
              game.providerSlug?.toLowerCase(),
              game.displayProvider?.toLowerCase(),
            ].filter(Boolean) as string[];

            return providerValues.some((value) => normalizedProviders.includes(value));
          });
      }
    }

    const combined = [...heroGames, ...filteredMintDaily];

    const start = Math.max(offset, 0);
    const end = limit ? start + limit : combined.length;

    return combined.slice(start, end);
  }
}

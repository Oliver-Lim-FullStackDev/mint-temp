import { Injectable } from '@nestjs/common';
import { HeroGamingApiRoutes } from 'src/shared/hero-gaming-api-routes';
import { HeroGamingClient } from 'src/shared/hero-gaming.client';
import { GameMapper } from './games.mapper';
import {
  Game,
  GameProvider,
  GameSearchResponse,
  HeroGameSearchBucket,
  RawGame,
  RawGameProvider,
} from './games.types';

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

  private extractGamesFromBucket(bucket?: HeroGameSearchBucket): RawGame[] {
    if (!bucket) {
      return [];
    }

    if (Array.isArray(bucket)) {
      return bucket;
    }

    if ('data' in bucket && Array.isArray(bucket.data)) {
      return bucket.data;
    }

    return [];
  }

  private normaliseHeroOrder(order?: 'ASC' | 'DESC'): string {
    if (order === 'DESC') {
      return 'DESC';
    }

    return 'sort_order';
  }

  private buildSearchBucket(params: {
    limit: number;
    order: string;
    tags: string[];
    text?: string;
  }) {
    const { limit, order, tags, text } = params;

    const bucket: Record<string, unknown> = {
      limit,
      order,
    };

    if (tags.length) {
      bucket.tags = tags;
    }

    if (text) {
      bucket.text = text;
    }

    return bucket;
  }

  async findAll(): Promise<Game[]> {
    const order = this.normaliseHeroOrder('ASC');

    const response = await this.hg.post<GameSearchResponse>(HeroGamingApiRoutes.gamesSearch, {
      q: {
        results: this.buildSearchBucket({
          limit: 999,
          order,
          tags: [],
        }),
      },
    });

    const rawGames = this.extractGamesFromBucket(response?.result?.results);

    return rawGames.map((game) => this.transform(game));
  }

  async findProviders(): Promise<GameProvider[]> {
    const providers = await this.hg.get<RawGameProvider[]>(`/game_providers`);

    const mapped = providers
      .map((provider) => {
        const slug =
          provider.slug ?? provider.tag ?? provider.id ?? provider.name ?? provider.displayName ?? provider.title;

        if (!slug) {
          return undefined;
        }

        const id = provider.id ?? slug;
        const name = provider.name ?? provider.displayName ?? provider.title ?? slug;
        const displayName = provider.displayName ?? provider.name ?? provider.title ?? name;

        return {
          id,
          slug,
          name,
          displayName,
        } satisfies GameProvider;
      })
      .filter((provider): provider is GameProvider => Boolean(provider))
      .reduce<GameProvider[]>((acc, provider) => {
        const exists = acc.find((existing) => existing.slug.toLowerCase() === provider.slug.toLowerCase());

        if (!exists) {
          acc.push(provider);
        }

        return acc;
      }, [])
      .sort((a, b) => a.displayName.localeCompare(b.displayName));

    return mapped;
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

    const effectiveTags = [...new Set(tags.map((tag) => tag.toLowerCase()))];

    const providerFilters = providers.length ? providers : provider ? [provider] : [];
    const normalizedProviders = providerFilters.map((value) => value.toLowerCase());

    const includeMintDaily =
      effectiveTags.includes('mint') || normalizedProviders.includes('mint');

    if (includeMintDaily && effectiveTags.includes('mint')) {
      effectiveTags.splice(effectiveTags.indexOf('mint'), 1);
    }

    const heroTags = effectiveTags.filter((tag) => tag !== 'mint');
    const heroProviders = Array.from(new Set(normalizedProviders.filter((value) => value !== 'mint')));

    const limitForRequest = limit ?? 999;
    const heroLimit = Math.max(offset ? limitForRequest + offset : limitForRequest, 1);
    const heroOrder = this.normaliseHeroOrder(order);

    const buildTagsForProvider = (providerSlug: string) => {
      const combined = new Set(heroTags);
      combined.add(providerSlug);
      return Array.from(combined);
    };

    const queryBuckets: Record<string, unknown> = {};

    if (heroProviders.length) {
      heroProviders.forEach((providerSlug) => {
        queryBuckets[providerSlug] = this.buildSearchBucket({
          limit: heroLimit,
          order: heroOrder,
          tags: buildTagsForProvider(providerSlug),
          text: search,
        });
      });
    } else {
      queryBuckets.results = this.buildSearchBucket({
        limit: heroLimit,
        order: heroOrder,
        tags: heroTags,
        text: search,
      });
    }

    const response = await this.hg.post<GameSearchResponse>(HeroGamingApiRoutes.gamesSearch, {
      q: queryBuckets,
    });

    const bucketsToRead = heroProviders.length ? heroProviders : ['results'];

    const rawHeroGames = bucketsToRead
      .flatMap((key) => this.extractGamesFromBucket(response?.result?.[key]))
      .filter(Boolean);

    const dedupedHeroGames = rawHeroGames.reduce<Record<string, Game>>((acc, rawGame) => {
      const mapped = this.transform(rawGame);
      acc[mapped.id] = mapped;
      return acc;
    }, {});

    let heroGames = Object.values(dedupedHeroGames);

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

import { NextRequest, NextResponse } from 'next/server';
import { mintApi } from '@mint/client';
import type { Game } from '@/modules/games/games.types';
import { GAMES_CATEGORY_DEFINITIONS } from '@/modules/games/state';
import { searchGames, type GamesSearchRequest } from './search/searchGames';

type ProviderOption = {
  value: string;
  label: string;
};

type ApiGameProvider = {
  id: string;
  slug: string;
  name: string;
  displayName: string;
};

type CategoryOption = {
  slug: string;
  label: string;
  count: number;
};

type GamesResponse = {
  games: Game[];
  meta: {
    total: number;
    categories: CategoryOption[];
    providers: ProviderOption[];
  };
};

function buildCategories(games: Game[]): CategoryOption[] {
  const gameTagSets = games.map((game) => {
    const combined = [
      ...(game.tags ?? []),
      ...(game.categories?.map((category) => category.slug) ?? []),
    ];

    return new Set(
      combined
        .map((tag) => tag?.toString().trim().toLowerCase())
        .filter((tag): tag is string => Boolean(tag)),
    );
  });

  return GAMES_CATEGORY_DEFINITIONS.map((definition) => {
    if (!definition.tags.length) {
      return {
        slug: definition.slug,
        label: definition.label,
        count: games.length,
      } satisfies CategoryOption;
    }

    const normalisedTags = definition.tags.map((tag) => tag.trim().toLowerCase());

    const count = gameTagSets.reduce((total, tags) => {
      return total + (normalisedTags.some((tag) => tags.has(tag)) ? 1 : 0);
    }, 0);

    return {
      slug: definition.slug,
      label: definition.label,
      count,
    } satisfies CategoryOption;
  });
}

function buildProviders(games: Game[], providersFromApi: ApiGameProvider[]): ProviderOption[] {
  const providerMap = new Map<string, ProviderOption>();

  providersFromApi.forEach((provider) => {
    const slug = provider.slug?.trim();

    if (!slug) return;

    const key = slug.toLowerCase();
    const label = provider.displayName?.trim() || provider.name?.trim() || slug;

    if (!providerMap.has(key)) {
      providerMap.set(key, {
        value: slug,
        label,
      });
    }
  });

  if (!providerMap.size) {
    games.forEach((game) => {
      const slug = (game.providerSlug ?? game.provider ?? '').trim();
      const label = (game.displayProvider ?? game.provider ?? slug)?.toString().trim();

      if (!slug) return;

      const key = slug.toLowerCase();

      if (!providerMap.has(key)) {
        providerMap.set(key, {
          value: slug,
          label: label || slug,
        });
      }
    });
  }

  return Array.from(providerMap.values()).sort((a, b) => a.label.localeCompare(b.label));
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const category = searchParams.get('category') ?? undefined;
    const search = searchParams.get('q') ?? undefined;
    const provider = searchParams.get('provider')?.trim() || undefined;
    const order = (searchParams.get('order') ?? 'ASC').toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    const limitParam = searchParams.get('limit');
    const offsetParam = searchParams.get('offset');

    const limit = limitParam ? Number.parseInt(limitParam, 10) : 9999;
    const offset = offsetParam ? Number.parseInt(offsetParam, 10) : 0;

    const tags = category && category !== 'all' ? [category] : [];

    const searchPayload: GamesSearchRequest = {
      tags,
      limit,
      offset,
      search,
      order,
      provider,
      providers: provider ? [provider] : undefined,
    };

    const [games, allGames, providers] = await Promise.all([
      searchGames(searchPayload),
      mintApi.get<Game[]>('/games/all'),
      mintApi.get<ApiGameProvider[]>('/games/providers'),
    ]);

    const providerOptions = buildProviders(allGames, providers ?? []);
    const categories = buildCategories(allGames);

    const response: GamesResponse = {
      games,
      meta: {
        total: games.length,
        categories,
        providers: providerOptions,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching games:', error);
    return NextResponse.json({ error: 'Failed to fetch games' }, { status: 500 });
  }
}

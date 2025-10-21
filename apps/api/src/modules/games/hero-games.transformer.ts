import { GameProvider, GameSearchResponse, HeroGameSearchBucket, RawGame, RawGameProvider } from './games.types';

export class HeroGamesTransformer {
  static extractGamesFromBucket(bucket?: HeroGameSearchBucket): RawGame[] {
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

  static normaliseOrder(order?: 'ASC' | 'DESC'): string {
    if (order === 'DESC') {
      return 'DESC';
    }

    return 'sort_order';
  }

  static normaliseProviderSlug(value: string): string {
    return value
      .trim()
      .toLowerCase()
      .replace(/[_\s]+/g, '-')
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  static normaliseProvider(value: string): string {
    const trimmed = value?.trim();

    if (!trimmed) {
      return '';
    }

    return trimmed[0].toUpperCase() + trimmed.slice(1).toLowerCase();
  }

  static buildSearchBucket(params: {
    limit: number;
    order: string;
    tags: string[];
    text?: string;
    providers?: string[];
  }): Record<string, unknown> {
    const { limit, order, tags, text, providers } = params;

    const bucket: Record<string, unknown> = {
      limit,
      order,
      tags,
    };

    if (text) {
      bucket.text = text;
    }

    if (providers?.length) {
      bucket.providers = providers;
    }

    return bucket;
  }

  static buildQueryBuckets(bucket: Record<string, unknown>, providers: string[]): Record<string, unknown> {
    if (providers.length) {
      return { search: bucket };
    }

    return { results: bucket };
  }

  static normaliseSearchProviders(providerFilters: string[]): string[] {
    return providerFilters.reduce<string[]>((acc, value) => {
      const trimmed = value?.toString().trim();

      if (!trimmed) {
        return acc;
      }

      const lower = trimmed.toLowerCase();

      if (lower === 'mint') {
        return acc;
      }

      const heroValue = this.normaliseProvider(trimmed);

      if (!heroValue) {
        return acc;
      }

      if (!acc.some((existing) => existing.toLowerCase() === lower)) {
        acc.push(heroValue);
      }

      return acc;
    }, []);
  }

  static mapProviders(providers: RawGameProvider[]): GameProvider[] {
    return providers
      .map((provider) => {
        if (!provider) {
          return undefined;
        }

        if (typeof provider === 'string') {
          const label = provider.trim();

          if (!label) {
            return undefined;
          }

          const slug = this.normaliseProviderSlug(label) || label.toLowerCase();

          return {
            id: slug,
            slug,
            name: label,
            displayName: label,
          } satisfies GameProvider;
        }

        const slugSource =
          provider.slug ?? provider.tag ?? provider.id ?? provider.name ?? provider.displayName ?? provider.title;

        if (!slugSource) {
          return undefined;
        }

        const preferredLabel =
          (provider.displayName ?? provider.name ?? provider.title ?? slugSource)?.toString().trim() ?? '';
        const label = preferredLabel || slugSource.toString();
        const slugFromSource = this.normaliseProviderSlug(slugSource.toString());
        const slug = slugFromSource || slugSource.toString().trim().toLowerCase();

        if (!slug) {
          return undefined;
        }

        const id = (provider.id ?? slug).toString();
        const name = (provider.name ?? label).toString().trim() || label;

        return {
          id,
          slug,
          name,
          displayName: label || name,
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
  }

  static extractGamesFromResponse(response: GameSearchResponse | undefined, bucketsToRead: string[]): RawGame[] {
    if (!response?.result) {
      return [];
    }

    return bucketsToRead.flatMap((key) => this.extractGamesFromBucket(response.result?.[key])).filter(Boolean);
  }
}

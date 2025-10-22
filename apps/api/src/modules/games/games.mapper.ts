import { Game, GameCategory, RawGame } from './games.types';

export const GameMapper = {
  fromApi(raw: RawGame): Game {
    const tags = Array.isArray(raw.tags)
      ? raw.tags
          .map((tag) => {
            if (!tag) return undefined;
            if (typeof tag === 'string') return tag;
            return tag.slug ?? tag.tag ?? tag.id ?? undefined;
          })
          .filter((tag): tag is string => Boolean(tag))
      : [];

    const categories = Array.isArray(raw.categories)
      ? raw.categories
          .map((category) => {
            if (!category) return undefined;

            const slug = category.slug ?? category.tag ?? category.id ?? category.title ?? category.name;

            if (!slug) return undefined;

            const normalised: GameCategory = {
              id: category.id ?? slug,
              slug,
              name: category.name ?? category.title ?? slug,
            };

            return normalised;
          })
          .filter((category): category is GameCategory => Boolean(category))
      : [];

    return {
      id: raw.id,
      title: raw.title,
      slug: raw.slug ?? raw.id,
      provider: raw.provider,
      providerSlug: raw.providerSlug ?? raw.provider,
      displayProvider: raw.displayProvider ?? raw.providerName ?? raw.provider,
      imageUrl: raw.imageUrl,
      titleUrl: raw.titleUrl,
      categories,
      tags,
    };
  },
};

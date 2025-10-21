export type CasinoCategoryDefinition = {
    slug: string;
    label: string;
    tags: string[];
  };
  
  export const CASINO_CATEGORY_DEFINITIONS: CasinoCategoryDefinition[] = [
    { slug: 'all', label: 'Explore', tags: [] },
    { slug: 'originals', label: 'Mint Originals', tags: ['originals'] },
    { slug: 'slots', label: 'Slots', tags: ['slots'] },
    { slug: 'game-show', label: 'Live Casino', tags: ['game-show'] },
    { slug: 'table-games', label: 'Table Games', tags: ['table-games'] },
    { slug: 'new', label: 'New Arrivals', tags: ['new'] },
    { slug: 'blackjack', label: 'Blackjack', tags: ['blackjack'] },
    { slug: 'roulette', label: 'Roulette', tags: ['roulette'] },
    { slug: 'baccarat', label: 'Baccarat', tags: ['baccarat'] },
  ];
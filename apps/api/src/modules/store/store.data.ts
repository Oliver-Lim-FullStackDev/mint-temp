import type { StoreItem } from '@mint/types/store';

export const STATIC_STORE_ITEMS: StoreItem[] = [
  {
    id: '5-spins',
    title: '5 Spins',
    description: 'Resets 3 x daily',
    price: { usd: 0, stars: 0 },
    imageUrl: '/assets/images/store/5spins.png',
    available: true,
  },

  {
    id: '10-spins',
    title: '10 Spins',
    description: 'Starter pack',
    price: { usd: 0.99, stars: 1 },
    imageUrl: '/assets/images/store/10spins.png',
    available: true,
  },

  {
    id: '20-spins',
    title: '20 Spins',
    description: 'Save 5%',
    price: { usd: 1.89, stars: 10 },
    imageUrl: '/assets/images/store/20spins.png',
    available: true,
  },

  {
    id: '50-spins',
    title: '50 Spins',
    description: 'Save 10%',
    price: { usd: 4.49, stars: 15 },
    imageUrl: '/assets/images/store/50spins.png',
    available: true,
  },

  {
    id: '75-spins',
    title: '75 Spins',
    description: 'Save 14%',
    price: { usd: 6.49, stars: 20 },
    imageUrl: '/assets/images/store/75spins.png',
    available: true,
  },

  {
    id: '100-spins',
    title: '100 Spins',
    description: 'Save 15%',
    price: { usd: 8.49, stars: 25 },
    imageUrl: '/assets/images/store/100spins.png',
    available: true,
  },

  {
    id: '200-spins',
    title: '200 Spins',
    description: 'Save 20%',
    price: { usd: 15.99, stars: 30 },
    imageUrl: '/assets/images/store/200spins.png',
    available: true,
  },
  {
    id: '300-spins',
    title: '300 Spins',
    description: 'Save 23%',
    price: { usd: 22.99, stars: 45 },
    imageUrl: '/assets/images/store/300spins.png',
    available: true,
  },
  {
    id: '500-spins',
    title: '500 Spins',
    description: 'Save 30%',
    price: { usd: 34.99, stars: 60 },
    imageUrl: '/assets/images/store/500spins.png',
    available: true,
  },
];

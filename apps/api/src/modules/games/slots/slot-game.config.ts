import { SlotGameConfig } from './slot-game.types';

const PUBLIC_ASSETS_PATH = '/assets/games/minty-spins';
const PUBLIC_SYMBOLS_PATH = `${PUBLIC_ASSETS_PATH}/symbols`;
const PUBLIC_SOUNDS_PATH = `${PUBLIC_ASSETS_PATH}/sounds`;

export const slotGameConfig: SlotGameConfig = {
  pfStrategy: 'vrf',
  gameId: 'mint_super_slots',
  currency: 'SPN',
  initialSpins: 0,
  initialCredits: 0,
  spinCost: 1,

  images: {
    path: PUBLIC_SYMBOLS_PATH,
  },

  // Final symbol weights (relative; no need to normalize)
  // Keys must match the visual entries below and your SVG filenames.
  symbolWeights: {
    wojak: 0.30,
    trezor: 0.14,
    chad: 0.83,
    bogdanoff: 0.98,
    saylor: 0.33,
    pepe: 0.28,
    minty: 0.31,
    musk: 0.59,
    trump: 0.75,
  },

  // Engine payouts (kept here; server applies them on play, not on init)
  payouts: {
    enableMatchMultipliers: true,
    horizontalMatches: {
      3: 1.0,
      4: 3.0,
      5: 4.0,
    },
    diagonalMatches: {
      3: 2.0,
    },
    symbolCounts: {
      trezor: {
        1: 1,
      },
      wojak: {
        1: 1
      },
    },
    jackpot: {
      symbol: '',
      count: 0,
      payout: 0,
    },
    // per-symbol rewards (these numbers will be multiplied by patternMultipliers on a win)
    rewards: {
      minty:     { MBX: 50, SPN: 0, XPP: 37, RTP: 3 },
      trump:     { MBX: 45, SPN: 0, XPP: 20, RTP: 2 },
      musk:      { MBX: 20, SPN: 0, XPP: 25, RTP: 2 },
      pepe:      { MBX: 20, SPN: 0, XPP: 20, RTP: 1 },
      chad:      { MBX: 20, SPN: 0, XPP: 15, RTP: 1 },
      saylor:    { MBX: 10, SPN: 0, XPP: 10, RTP: 0 },
      bogdanoff: { MBX: 5,  SPN: 0, XPP: 0,  RTP: 0 },
      wojak:     { MBX: 10, SPN: 0, XPP: 0,  RTP: 0 },
      trezor:    { MBX: 5,  SPN: 0, XPP: 0,  RTP: 0 },
    },
  },

  sounds: {
    start: `${PUBLIC_SOUNDS_PATH}/start.mp3`,
    end: `${PUBLIC_SOUNDS_PATH}/end.mp3`,
    win: `${PUBLIC_SOUNDS_PATH}/win.mp3`,
  },

  // --- visuals (DISPLAY ONLY; TABLES/ICONS) ---
  visuals: {
    multipliers: [{
      key: '3-horizontal',
      label: 'Row of 3',
      multiplier: 1.0,
      imageUrl: `${PUBLIC_SYMBOLS_PATH}/3-horizontal.svg`,
    },
    {
      key: '3-diagonal',
      label: '3 Diagonal',
      multiplier: 2.0,
      imageUrl: `${PUBLIC_SYMBOLS_PATH}/3-diagonal.svg`,
    },
    {
      key: '4-horizontal',
      label: 'Row of 4',
      multiplier: 3.0,
      imageUrl: `${PUBLIC_SYMBOLS_PATH}/4-horizontal.svg`,
    },
    {
      key: '5-horizontal',
      label: 'Row of 5',
      multiplier: 4.0,
      imageUrl: `${PUBLIC_SYMBOLS_PATH}/5-horizontal.svg`,
    }],
    winCombos: [
      {
        key: 'minty',
        label: 'Minty',
        rewards: { MBX: 50, SPN: 0, RTP: 3, XPP: 37 },
        imageUrl: `${PUBLIC_SYMBOLS_PATH}/minty.svg`,
      },
      {
        key: 'trump',
        label: 'Trump',
        rewards: { MBX: 45, SPN: 0, RTP: 2, XPP: 20 },
        imageUrl: `${PUBLIC_SYMBOLS_PATH}/trump.svg`,
      },
      {
        key: 'musk',
        label: 'Musk',
        rewards: { MBX: 20, SPN: 0, RTP: 2, XPP: 25 },
        imageUrl: `${PUBLIC_SYMBOLS_PATH}/musk.svg`,
      },
      {
        key: 'pepe',
        label: 'Pepe',
        rewards: { MBX: 20, SPN: 0, RTP: 1, XPP: 20 },
        imageUrl: `${PUBLIC_SYMBOLS_PATH}/pepe.svg`,
      },
      {
        key: 'chad',
        label: 'Chad',
        rewards: { MBX: 20, SPN: 0, RTP: 1, XPP: 15 },
        imageUrl: `${PUBLIC_SYMBOLS_PATH}/chad.svg`,
      },
      {
        key: 'saylor',
        label: 'Saylor',
        rewards: { MBX: 10, SPN: 0, RTP: 0, XPP: 10 },
        imageUrl: `${PUBLIC_SYMBOLS_PATH}/saylor.svg`,
      },
      {
        key: 'bogdanoff',
        label: 'Bogdanoff',
        rewards: { MBX: 5, SPN: 0, RTP: 0, XPP: 0 },
        imageUrl: `${PUBLIC_SYMBOLS_PATH}/bogdanoff.svg`,
        special: true,
      },

      // special symbols
      {
        key: 'wojak',
        label: 'Wojak found anywhere',
        rewards: { MBX: 10, SPN: 0, RTP: 0, XPP: 0 },
        imageUrl: `${PUBLIC_SYMBOLS_PATH}/wojak.svg`,
        special: true,
      },
      {
        key: 'trezor',
        label: 'Dukwon’s Trezor found anywhere',
        rewards: { MBX: 5, SPN: 0, RTP: 0, XPP: 0 },
        imageUrl: `${PUBLIC_SYMBOLS_PATH}/trezor.svg`,
        special: true,
      },
    ],
  },
};

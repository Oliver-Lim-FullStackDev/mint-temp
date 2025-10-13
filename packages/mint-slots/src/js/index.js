import Slot from "./Slot.js";

const config = {
  inverted: false, // true: reels spin from top to bottom; false: reels spin from bottom to top

  // Game configuration
  gameConfig: {
    // Balance settings
    initialSpins: 20,
    initialCredits: 100,
    spinCost: 0, // Free spins

    images: {
      path: null,
    },

    // Symbol probability weights (must sum to a positive number)
    symbolWeights: {
      minty: 15,
      musk: 15,
      saylor: 5, // Rare symbol
      trump: 2, // Very rare symbol (jackpot)
      pepe: 10,
      chad: 15,
      bogdanoff: 15,
      wojak: 13,
      trezor: 10,
    },

    // Payout configuration
    payouts: {
      // Horizontal matches
      horizontalMatches: {
        3: 10, // 3 in a row: 10 credits
        4: 25, // 4 in a row: 25 credits
        5: 100, // 5 in a row: 100 credits
      },
      // Diagonal matches
      diagonalMatches: {
        3: 15, // 3 in a diagonal: 15 credits
        4: 30, // 4 in a diagonal: 30 credits
        5: 150, // 5 in a diagonal: 150 credits
      },
      // Special symbol counts anywhere
      symbolCounts: {
        saylor: {
          1: 5, // 1 Darth Vader: 5 credits
          2: 15, // 2 Darth Vaders: 15 credits
          3: 50, // 3 Darth Vaders: 50 credits
        },
      },
      // Jackpot configuration
      jackpot: {
        symbol: "trump",
        count: 5,
        payout: 1000,
      },
    },
  },

  // Event handlers
  onSpinStart: (symbols) => {
    console.log("onSpinStart", symbols);
  },
  onSpinEnd: (symbols, winResult) => {
    console.log("onSpinEnd", symbols);
    if (winResult && winResult.payout > 0) {
      console.log("Win!", winResult);
    }
  },
};

const slot = new Slot(document.getElementById("slots"), config);

export default class Config {
  constructor(customConfig = {}) {
    // Testing flag to force jackpot on next spin
    this.forceJackpot = false;
    // Game balance settings
    this.initialSpins = customConfig.initialSpins || 20;
    this.initialCredits = customConfig.initialCredits || 100;

    this.sounds = customConfig.sounds || {};

    // Symbol probability weights
    this.symbolWeights = customConfig.symbolWeights || {
      minty: 15,
      musk: 15,
      saylor: 5, // Rare symbol
      trump: 2, // Very rare symbol (jackpot)
      pepe: 10,
      chad: 15,
      bogdanoff: 15,
      wojak: 13,
      trezor: 10,
    };

    // Calculate total weight for probability normalization
    this.totalWeight = Object.values(this.symbolWeights).reduce(
      (a, b) => a + b,
      0,
    );

    // Pattern probability controls (chance of generating specific patterns)
    this.patternProbabilities = customConfig.patternProbabilities || {
      // Probability of generating horizontal matches (out of 100)
      horizontalMatches: {
        3: 5, // 5% chance for 3 in a row
        4: 2, // 2% chance for 4 in a row
        5: 1, // 1% chance for 5 in a row (jackpot)
      },
      // Probability of generating diagonal matches (out of 100)
      diagonalMatches: {
        3: 4, // 4% chance for 3 in a diagonal
        4: 2, // 2% chance for 4 in a diagonal
        5: 1, // 1% chance for 5 in a diagonal
      },
      // Probability of generating special symbol counts (out of 100)
      symbolCounts: {
        saylor: {
          3: 3, // 3% chance for 3 Darth Vaders
        },
        trump: {
          5: 0.5, // 0.5% chance for jackpot (5 death stars)
        },
      },
      // Default is random generation with no pattern
      random: 85, // 85% chance for completely random generation
    };

    // Payout configuration
    this.payouts = customConfig.payouts || {
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
    };

    // Cost per spin (0 means free spins)
    this.spinCost = customConfig.spinCost || 0;
    this.images = customConfig.images;
  }

  // Get a random symbol based on probability weights
  getWeightedRandomSymbol() {
    let randomValue = Math.random() * this.totalWeight;

    for (const symbol in this.symbolWeights) {
      const weight = this.symbolWeights[symbol];
      if (randomValue < weight) {
        return symbol;
      }
      randomValue -= weight;
    }

    // Fallback (should never reach here if weights sum to totalWeight)
    return Object.keys(this.symbolWeights)[0];
  }

  // Determine if we should generate a specific pattern based on configured probabilities
  shouldGeneratePattern() {
    // If jackpot is forced, return jackpot pattern
    if (this.forceJackpot) {
      // Reset the flag so it only happens once
      this.forceJackpot = false;
      console.log("Forcing jackpot on this spin!");
      return {
        type: "horizontal",
        count: 5,
        symbol: this.payouts.jackpot.symbol,
      };
    }

    // Roll a number between 0-100
    const roll = Math.random() * 100;

    // Track cumulative probability
    let cumulativeProbability = 0;

    // Check horizontal match probabilities
    for (const count of [5, 4, 3]) {
      // Check highest counts first
      if (this.patternProbabilities.horizontalMatches[count]) {
        cumulativeProbability +=
          this.patternProbabilities.horizontalMatches[count];
        if (roll < cumulativeProbability) {
          return {
            type: "horizontal",
            count: count,
          };
        }
      }
    }

    // Check diagonal match probabilities
    for (const count of [5, 4, 3]) {
      // Check highest counts first
      if (this.patternProbabilities.diagonalMatches[count]) {
        cumulativeProbability +=
          this.patternProbabilities.diagonalMatches[count];
        if (roll < cumulativeProbability) {
          return {
            type: "diagonal",
            count: count,
          };
        }
      }
    }

    // Check special symbol count probabilities
    for (const symbol in this.patternProbabilities.symbolCounts) {
      for (const count in this.patternProbabilities.symbolCounts[symbol]) {
        cumulativeProbability +=
          this.patternProbabilities.symbolCounts[symbol][count];
        if (roll < cumulativeProbability) {
          return {
            type: "symbolCount",
            symbol: symbol,
            count: parseInt(count),
          };
        }
      }
    }

    // Default to random generation
    return { type: "random" };
  }

  // Generate a grid with a specific pattern
  generatePatternGrid(pattern) {
    // Create a 5x3 grid filled with random symbols
    const grid = [
      [
        this.getWeightedRandomSymbol(),
        this.getWeightedRandomSymbol(),
        this.getWeightedRandomSymbol(),
      ],
      [
        this.getWeightedRandomSymbol(),
        this.getWeightedRandomSymbol(),
        this.getWeightedRandomSymbol(),
      ],
      [
        this.getWeightedRandomSymbol(),
        this.getWeightedRandomSymbol(),
        this.getWeightedRandomSymbol(),
      ],
      [
        this.getWeightedRandomSymbol(),
        this.getWeightedRandomSymbol(),
        this.getWeightedRandomSymbol(),
      ],
      [
        this.getWeightedRandomSymbol(),
        this.getWeightedRandomSymbol(),
        this.getWeightedRandomSymbol(),
      ],
    ];

    // Apply pattern based on type
    switch (pattern.type) {
      case "horizontal":
        this.applyHorizontalPattern(grid, pattern.count, pattern.symbol);
        break;
      case "diagonal":
        this.applyDiagonalPattern(grid, pattern.count);
        break;
      case "symbolCount":
        this.applySymbolCountPattern(grid, pattern.symbol, pattern.count);
        break;
    }

    return grid;
  }

  // Apply a horizontal match pattern to the grid
  applyHorizontalPattern(grid, count, forcedSymbol = null) {
    // Select a random row
    const row = Math.floor(Math.random() * 3);

    // Select a random starting position that allows for the full pattern
    const maxStartPos = 5 - count;
    const startPos = Math.floor(Math.random() * (maxStartPos + 1));

    // Use the forced symbol if provided, otherwise select a random symbol (weighted)
    const symbol = forcedSymbol || this.getWeightedRandomSymbol();

    // Apply the pattern
    for (let i = 0; i < count; i++) {
      grid[startPos + i][row] = symbol;
    }
  }

  // Apply a diagonal match pattern to the grid
  applyDiagonalPattern(grid, count) {
    // Determine if it's a left-to-right or right-to-left diagonal
    const isLeftToRight = Math.random() < 0.5;

    // Select a random starting position that allows for the full pattern
    const maxStartRow = 3 - count;
    const startRow = Math.floor(Math.random() * (maxStartRow + 1));

    let startCol;
    if (isLeftToRight) {
      // Left-to-right diagonal
      const maxStartCol = 5 - count;
      startCol = Math.floor(Math.random() * (maxStartCol + 1));
    } else {
      // Right-to-left diagonal
      const minStartCol = count - 1;
      startCol = minStartCol + Math.floor(Math.random() * (5 - minStartCol));
    }

    // Select a random symbol (weighted)
    const symbol = this.getWeightedRandomSymbol();

    // Apply the pattern
    for (let i = 0; i < count; i++) {
      const col = isLeftToRight ? startCol + i : startCol - i;
      const row = startRow + i;
      grid[col][row] = symbol;
    }
  }

  // Apply a symbol count pattern to the grid
  applySymbolCountPattern(grid, symbol, count) {
    // Get random positions for the symbols
    const positions = [];
    for (let col = 0; col < 5; col++) {
      for (let row = 0; row < 3; row++) {
        positions.push({ col, row });
      }
    }

    // Shuffle positions
    for (let i = positions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [positions[i], positions[j]] = [positions[j], positions[i]];
    }

    // Place the symbols in the first 'count' positions
    for (let i = 0; i < count; i++) {
      if (i < positions.length) {
        const { col, row } = positions[i];
        grid[col][row] = symbol;
      }
    }
  }
}

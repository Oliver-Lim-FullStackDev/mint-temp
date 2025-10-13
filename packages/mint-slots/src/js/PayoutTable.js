export default class PayoutTable {
  constructor(config = {}) {
    // Default payout configuration
    this.payouts = config.payouts || {
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
      // Jackpot combinations
      jackpot: {
        symbol: "trump",
        count: 5,
        payout: 1000,
      },
    };
  }

  // Evaluate the grid for winning combinations
  evaluateGrid(symbols) {
    let totalWin = 0;
    let winningCombinations = [];

    // Check horizontal matches
    totalWin += this.checkHorizontalMatches(symbols, winningCombinations);

    // Check diagonal matches
    totalWin += this.checkDiagonalMatches(symbols, winningCombinations);

    // Check special symbol counts
    totalWin += this.checkSymbolCounts(symbols, winningCombinations);

    // Check jackpot
    const jackpotWin = this.checkJackpot(symbols);
    if (jackpotWin > 0) {
      totalWin += jackpotWin;
      winningCombinations.push({
        type: "jackpot",
        symbol: this.payouts.jackpot.symbol,
        count: this.payouts.jackpot.count,
        payout: jackpotWin,
      });
    }

    return {
      payout: totalWin,
      winningCombinations,
      hasJackpot: jackpotWin > 0,
    };
  }

  // Check for horizontal matches (3, 4, or 5 in a row)
  checkHorizontalMatches(symbols, winningCombinations) {
    let totalWin = 0;

    // For each row (we have 3 rows in a 5x3 grid)
    for (let row = 0; row < 3; row++) {
      // Get the symbols in this row
      const rowSymbols = symbols.map((reel) => reel[row]);

      // Check for matches starting from each position
      for (let startPos = 0; startPos <= 2; startPos++) {
        // Maximum possible match length from this position
        const maxMatchLength = Math.min(5, 5 - startPos);

        // Check for the longest match first
        for (
          let matchLength = maxMatchLength;
          matchLength >= 3;
          matchLength--
        ) {
          const symbolsToCheck = rowSymbols.slice(
            startPos,
            startPos + matchLength,
          );
          const firstSymbol = symbolsToCheck[0];

          // Check if all symbols in the sequence match
          if (symbolsToCheck.every((symbol) => symbol === firstSymbol)) {
            const payout = this.payouts.horizontalMatches[matchLength];
            if (payout) {
              totalWin += payout;
              winningCombinations.push({
                type: "horizontal",
                symbol: firstSymbol,
                count: matchLength,
                row: row,
                startReel: startPos,
                payout: payout,
              });

              // Skip checking shorter matches for this position
              break;
            }
          }
        }
      }
    }

    return totalWin;
  }

  // Check for diagonal matches
  checkDiagonalMatches(symbols, winningCombinations) {
    let totalWin = 0;

    // Check main diagonal (top-left to bottom-right)
    // We can have diagonals of length 3, 4, or 5 depending on the starting position
    const diagonalStartPositions = [
      { startReel: 0, startRow: 0, maxLength: 3 }, // Main diagonal
      { startReel: 1, startRow: 0, maxLength: 3 }, // Partial diagonal
      { startReel: 0, startRow: 1, maxLength: 3 }, // Partial diagonal
      { startReel: 2, startRow: 0, maxLength: 3 }, // Partial diagonal
      { startReel: 0, startRow: 2, maxLength: 3 }, // Partial diagonal
    ];

    // Check each possible diagonal
    for (const { startReel, startRow, maxLength } of diagonalStartPositions) {
      // Check main diagonal (top-left to bottom-right)
      totalWin += this.checkSingleDiagonal(
        symbols,
        winningCombinations,
        startReel,
        startRow,
        1,
        1,
        maxLength,
        "diagonal-right",
      );

      // Check anti-diagonal (top-right to bottom-left)
      totalWin += this.checkSingleDiagonal(
        symbols,
        winningCombinations,
        startReel + maxLength - 1,
        startRow,
        -1,
        1,
        maxLength,
        "diagonal-left",
      );
    }

    return totalWin;
  }

  // Helper method to check a single diagonal line
  checkSingleDiagonal(
    symbols,
    winningCombinations,
    startReel,
    startRow,
    reelStep,
    rowStep,
    maxLength,
    diagonalType,
  ) {
    // Make sure we don't go out of bounds
    if (
      startReel < 0 ||
      startReel >= symbols.length ||
      startRow < 0 ||
      startRow >= symbols[0].length
    ) {
      return 0;
    }

    let totalWin = 0;

    // Get the symbols in this diagonal
    const diagonalSymbols = [];
    for (let i = 0; i < maxLength; i++) {
      const reel = startReel + i * reelStep;
      const row = startRow + i * rowStep;

      // Check if we're still within bounds
      if (
        reel >= 0 &&
        reel < symbols.length &&
        row >= 0 &&
        row < symbols[0].length
      ) {
        diagonalSymbols.push(symbols[reel][row]);
      } else {
        break;
      }
    }

    // Check for matches of different lengths
    for (
      let matchLength = diagonalSymbols.length;
      matchLength >= 3;
      matchLength--
    ) {
      const symbolsToCheck = diagonalSymbols.slice(0, matchLength);
      const firstSymbol = symbolsToCheck[0];

      // Check if all symbols in the sequence match
      if (symbolsToCheck.every((symbol) => symbol === firstSymbol)) {
        const payout = this.payouts.diagonalMatches[matchLength];
        if (payout) {
          totalWin += payout;
          winningCombinations.push({
            type: diagonalType,
            symbol: firstSymbol,
            count: matchLength,
            startReel: startReel,
            startRow: startRow,
            payout: payout,
          });

          // Skip checking shorter matches for this diagonal
          break;
        }
      }
    }

    return totalWin;
  }

  // Check for special symbols appearing anywhere
  checkSymbolCounts(symbols, winningCombinations) {
    let totalWin = 0;

    // Count occurrences of each symbol
    const symbolCounts = {};

    // Flatten the grid and count symbols
    for (let reel = 0; reel < symbols.length; reel++) {
      for (let row = 0; row < symbols[reel].length; row++) {
        const symbol = symbols[reel][row];
        symbolCounts[symbol] = (symbolCounts[symbol] || 0) + 1;
      }
    }

    // Check if any special symbols have payouts
    for (const symbol in this.payouts.symbolCounts) {
      const count = symbolCounts[symbol] || 0;
      const payoutTable = this.payouts.symbolCounts[symbol];

      // Find the highest applicable payout
      let highestCount = 0;
      let highestPayout = 0;

      for (const countStr in payoutTable) {
        const countNum = parseInt(countStr);
        if (count >= countNum && countNum > highestCount) {
          highestCount = countNum;
          highestPayout = payoutTable[countStr];
        }
      }

      if (highestPayout > 0) {
        totalWin += highestPayout;
        winningCombinations.push({
          type: "symbolCount",
          symbol: symbol,
          count: highestCount,
          actualCount: count,
          payout: highestPayout,
        });
      }
    }

    return totalWin;
  }

  // Check for jackpot combination
  checkJackpot(symbols) {
    const jackpot = this.payouts.jackpot;
    if (!jackpot) return 0;

    // For jackpot, we need the exact symbol in all positions
    let count = 0;

    // Count occurrences of the jackpot symbol
    for (let reel = 0; reel < symbols.length; reel++) {
      for (let row = 0; row < symbols[reel].length; row++) {
        if (symbols[reel][row] === jackpot.symbol) {
          count++;
        }
      }
    }

    // Return jackpot amount if the count matches
    return count >= jackpot.count ? jackpot.payout : 0;
  }
}

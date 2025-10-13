import Reel from "./Reel.js";
import Symbol from "./Symbol.js";
import PayoutTable from "./PayoutTable.js";
import Config from "./Config.js";

export default class Slot {
  constructor(domElement, config = {}) {
    // Initialize game configuration
    this.config = config;
    this.gameConfig = new Config(config.gameConfig || {});
    this._isSpinning = false;

    // Set the config for weighted symbol selection
    Symbol.setConfig(this.gameConfig);

    // Sounds
    const { sounds } = this.gameConfig
    this.sounds = {
      start: sounds.start ? new Audio(sounds.start) : null,
      end:   sounds.end   ? new Audio(sounds.end)   : null,
      win:   sounds.win   ? new Audio(sounds.win)   : null,
    };
    // Eager preload
    Object.values(this.sounds).forEach(a => { if (a) { a.preload = 'auto'; a.load?.(); } });

    // Initialize balance system (override from server result if provided)
    if (config.mode === 'server' && config.result) {
      this.spinsRemaining = config.result.spinsRemaining;
      this.credits       = config.result.credits;
    } else {
      // Initialize payout table
      this.payoutTable = new PayoutTable({
        payouts: this.gameConfig.payouts,
      });

      this.spinsRemaining = this.gameConfig.initialSpins;
      this.credits       = this.gameConfig.initialCredits;
    }


    // Preload symbols
    Symbol.preload();

    this.currentSymbols = [
      ["trump", "trump", "trump"],
      ["trump", "trump", "trump"],
      ["trump", "trump", "trump"],
      ["trump", "trump", "trump"],
      ["trump", "trump", "trump"],
    ];

    this.nextSymbols = [
      ["trump", "trump", "trump"],
      ["trump", "trump", "trump"],
      ["trump", "trump", "trump"],
      ["trump", "trump", "trump"],
      ["trump", "trump", "trump"],
    ];

    this.container = domElement;

    this.reels = Array.from(this.container.getElementsByClassName("reel")).map(
      (reelContainer, idx) =>
        new Reel(reelContainer, idx, this.currentSymbols[idx], () => {
          this.playSound('end');   // Play end sound when reel is done
        }),
    );

    // Set up UI elements
    if (this.config.showControls) {
      this.spinButton = document.getElementById("spin");
      this.spinButton.addEventListener("click", () => this.spin());

      this.autoPlayCheckbox = document.getElementById("autoplay");

      // Set up balance display elements
      this.spinsDisplay = document.getElementById("spins-remaining");
      this.creditsDisplay = document.getElementById("credits");
      this.winDisplay = document.getElementById("win-amount");

      // Initialize jackpot display
      this.jackpotDisplay = document.getElementById("jp");
      this.jackpotDisplay.textContent = this.formatNumber(
        this.gameConfig.payouts.jackpot.payout,
      );

      // Update UI with initial values
      this.updateBalanceDisplay();

      // Add keyboard shortcut for testing jackpot (press 'j')
      document.addEventListener("keydown", (event) => {
      if (event.key === "j" || event.key === "J") {
        this.forceJackpot();
      }
    });
    }

    if (config.inverted) {
      this.container.classList.add("inverted");
    }
  }

  init({ spinsRemaining, credits }) {
    this.spinsRemaining = spinsRemaining;
    this.credits = credits;

    if (this.config.showControls) {
      this.updateBalanceDisplay();
    }
  };

  playSound(key) {
    const a = this.sounds?.[key];
    if (!a) return;

    try {
      // For per-reel stop we need overlap → play on a cloned element
      const el = a.cloneNode(true);

      // keep cloned element’s basic props
      try { el.volume = a.volume; el.playbackRate = a.playbackRate; } catch {}

      // skip MP3 encoder padding; harmless for ogg/wav
      el.currentTime = 0.01;

      // fire & forget (avoid unhandled promise noise)
      const p = el.play?.();
      if (p && typeof p.catch === 'function') p.catch(() => {});

      // clean up cloned nodes after they finish so we don’t leak
      el.addEventListener('ended', () => {
        try { el.remove() }
        catch {}
      }, { once: true });
    } catch (_) {}
  }

  // Format number with commas for display
  formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  // Update balance displays
  updateBalanceDisplay() {
    if (!this.config.showControls) return;
    if (!this.spinsDisplay || !this.creditsDisplay || !this.spinButton || !this.autoPlayCheckbox) return;

    this.spinsDisplay.textContent = String(this.spinsRemaining);
    this.creditsDisplay.textContent = this.formatNumber(this.credits);

    if (this.spinsRemaining <= 0) {
      this.spinButton.disabled = true;
      this.autoPlayCheckbox.checked = false;
      this.autoPlayCheckbox.disabled = true;
    } else {
      this.spinButton.disabled = false;
      this.autoPlayCheckbox.disabled = false;
    }
  }

  // Display win notification
  displayWin(winResult) {
    if (this.config.showControls) {
      // Update win display
      this.winDisplay.textContent = this.formatNumber(winResult.payout);

      // Flash win display for visibility
      this.winDisplay.classList.add("win-flash");

      setTimeout(() => {
        this.winDisplay.classList.remove("win-flash");
      }, 2000);
    }

    // Highlight winning symbols
    this.highlightWinningSymbols(winResult.winningCombinations);

    // Show jackpot notification if applicable
    if (winResult.hasJackpot) {
      this.showJackpotNotification();
    }
  }

  // Highlight winning symbols with animations
  highlightWinningSymbols(winningCombinations) {
    // First, remove any existing win classes
    this.clearWinHighlights();

    // Process each winning combination
    winningCombinations.forEach((combo) => {
      switch (combo.type) {
        case "horizontal":
          this.highlightHorizontalWin(combo);
          break;
        case "diagonal-right":
        case "diagonal-left":
          this.highlightDiagonalWin(combo);
          break;
        case "symbolCount":
          this.highlightSymbolCountWin(combo);
          break;
        // Other win types don't have specific positions to highlight
      }
    });

    // Clear highlights after animation completes
    /*setTimeout(() => {
      this.clearWinHighlights();
    }, 1500);*/
  }

  // Clear all win highlights
  clearWinHighlights() {
    const allSymbols = this.container.querySelectorAll(".reel img");
    allSymbols.forEach((el) =>
      el.classList.remove("win-horizontal", "win-diagonal", "win-symbol")
    );
  }

  // Highlight horizontal winning symbols
  highlightHorizontalWin(combo) {
    const { startRow, startReel, count } = combo;

    // Get all symbol elements in the winning row
    for (let i = startReel; i < startReel + count; i++) {
      const symbolElement = this.getSymbolElement(i, startRow);
      if (symbolElement) {
        symbolElement.classList.add("win-horizontal");
      }
    }
  }

  // Highlight diagonal winning symbols
  highlightDiagonalWin(combo) {
    const { startReel, startRow, count, type } = combo;
    const reelStep = type === "diagonal-right" ? 1 : -1;

    // Get all symbol elements in the winning diagonal
    for (let i = 0; i < count; i++) {
      const reel = startReel + i * reelStep;
      const row = startRow + i;

      // Make sure we're within the grid bounds
      if (reel >= 0 && reel < 5 && row >= 0 && row < 3) {
        const symbolElement = this.getSymbolElement(reel, row);
        if (symbolElement) {
          symbolElement.classList.add("win-diagonal");
          // Add a debug indicator to help troubleshoot
          console.log(
            `Added diagonal highlight to symbol at reel ${reel}, row ${row}`,
          );
        } else {
          console.log(
            `Could not find symbol element at reel ${reel}, row ${row}`,
          );
        }
      }
    }
  }

  // Highlight symbols for symbol count wins (like Darth Vader appearing anywhere)
  highlightSymbolCountWin(combo) {
    const { symbol } = combo;

    // Find all instances of the winning symbol in the grid
    for (let reel = 0; reel < 5; reel++) {
      for (let row = 0; row < 3; row++) {
        // Check if this position has the winning symbol
        if (this.nextSymbols[reel][row] === symbol) {
          const symbolElement = this.getSymbolElement(reel, row);
          if (symbolElement) {
            symbolElement.classList.add("win-symbol");
            console.log(
              `Added symbol win highlight to ${symbol} at reel ${reel}, row ${row}`,
            );
          }
        }
      }
    }
  }

  // Helper to get symbol element at specific position
  getSymbolElement(reel, row) {
    // Get the symbol container within the reel
    const symbolContainer = this.reels[reel].symbolContainer;

    // After a spin, the last 3 symbols in each reel are the visible ones
    // We need to get the visible symbols (last 3 in the container)
    const visibleSymbols = Array.from(
      symbolContainer.querySelectorAll("img"),
    ).slice(-3);

    // Return the symbol at the specified row
    return visibleSymbols[row];
  }

  // Show jackpot notification
  showJackpotNotification() {
    const jackpotNotification = document.getElementById("jackpot-notification");
    if (jackpotNotification) {
      jackpotNotification.classList.add("show");
      setTimeout(() => {
        jackpotNotification.classList.remove("show");
      }, 3000);
    }
  }

  async spin({ resultPromise, minSpinMs = 600 } = {}) {
    if (this.config.mode !== 'server' && this.spinsRemaining <= 0) return;

    this.playSound('start');
    if (this.winDisplay) this.winDisplay.textContent = '0';

    // ---------- SERVER ----------
    if (this.config.mode === 'server') {
      if (resultPromise) {
        if (this._isSpinning) return;          // <-- guard duplicate starts
        this._isSpinning = true;

        // Start immediately (overflow hidden, disable btn, clear highlights)
        this.onSpinStart(this.currentSymbols);
        // Begin continuous motion using same animation
        this.reels.forEach(r => r.startLoop());

        // Enforce a minimum spin time
        const delay = new Promise(res => setTimeout(res, minSpinMs));

        let serverResult;
        try {
          [serverResult] = await Promise.all([resultPromise, delay]);
        } catch {
          // Graceful exit on error
          this.reels.forEach(r => r.resolveTo(null)); // cancel resolve
          await Promise.all(this.reels.map(r => r.stopLoop()));
          this.onSpinEnd(this.currentSymbols);
          this._isSpinning = false;
          return;
        }

        const { data, spinsRemaining, credits } = serverResult || {};
        if (!data) {
          await Promise.all(this.reels.map(r => r.stopLoop()));
          this.onSpinEnd(this.currentSymbols);
          this._isSpinning = false;
          return;
        }

        if (typeof spinsRemaining === 'number') this.spinsRemaining = spinsRemaining;
        if (this.config.showControls) this.updateBalanceDisplay();

        this.nextSymbols = data;

        // Request each reel to resolve to final 3 WITHOUT stopping motion
        this.reels.forEach((reel, i) => reel.resolveTo(data[i]));

        // Wait until all reels have landed naturally
        await Promise.all(this.reels.map(r => r.whenSettled()));

        // Feed result to onSpinEnd (plays end/win SFX, restores overflow, highlights)
        this.config.result = serverResult;
        this.onSpinEnd(this.nextSymbols);

        // Align credits to server after end (avoid double crediting)
        if (typeof credits === 'number') {
          this.credits = credits;
          if (this.config.showControls) this.updateBalanceDisplay();
        }

        this._isSpinning = false;
        return;
      }

      // Legacy: result already present on config
      if (this.config.result) {
        const { data, spinsRemaining, credits } = this.config.result;
        if (typeof spinsRemaining === 'number') this.spinsRemaining = spinsRemaining;

        this.nextSymbols = data;
        this.onSpinStart(data);
        this.reels.forEach((reel, i) => reel.renderSymbols(data[i]));
        await Promise.all(this.reels.map(r => r.spin()));
        this.onSpinEnd(this.nextSymbols);
        this._isSpinning = false;

        if (typeof credits === 'number') {
          this.credits = credits;
          if (this.config.showControls) this.updateBalanceDisplay();
        }
        return;
      }
    }

    // ---------- LOCAL ----------
    this.spinsRemaining--;
    if (this.gameConfig.spinCost > 0) this.credits -= this.gameConfig.spinCost;
    if (this.config.showControls) this.updateBalanceDisplay();

    this.currentSymbols = this.nextSymbols;

    const pattern = this.gameConfig.shouldGeneratePattern();
    if (pattern.type !== 'random') {
      this.nextSymbols = this.gameConfig.generatePatternGrid(pattern);
    } else {
      this.nextSymbols = [
        [Symbol.random(), Symbol.random(), Symbol.random()],
        [Symbol.random(), Symbol.random(), Symbol.random()],
        [Symbol.random(), Symbol.random(), Symbol.random()],
        [Symbol.random(), Symbol.random(), Symbol.random()],
        [Symbol.random(), Symbol.random(), Symbol.random()],
      ];
    }

    this.onSpinStart(this.nextSymbols);
    this.reels.forEach(reel => reel.renderSymbols(this.nextSymbols[reel.idx]));
    await Promise.all(this.reels.map(reel => reel.spin()));
    this.onSpinEnd(this.nextSymbols);
  }

  onSpinStart(symbols) {
    if (this.config.showControls) {
      this.spinButton.disabled = true;
    }

    this.clearWinHighlights();
    this.reels.map((reel) => reel.reelContainer.style.overflow = 'hidden');

    this.config.onSpinStart?.(symbols);
  }

  onSpinEnd(symbols) {
    // Evaluate win
    const winResult = this.config.mode === 'server' ? this.config.result : this.payoutTable.evaluateGrid(symbols);

    // allow for animations to show outside the parent box
    this.reels.map((reel) => reel.reelContainer.style.overflow = 'visible');

    // Update credits with winnings
    const hasCombos = (winResult.winningCombinations?.length ?? 0) > 0 || !!winResult.hasJackpot;

    if (hasCombos) {
      this.playSound('win');
      this.credits += winResult.payout;
      this.displayWin(winResult);
    }

    // Update balance display if controls are shown
    if (this.config.showControls) this.updateBalanceDisplay();

    // Enable spin button if we have spins remaining
    if (this.spinsRemaining > 0 && this.config.showControls && this.spinButton) {
      this.spinButton.disabled = false;
    }

    // Continue autoplay only if checkbox exists
    if (this.autoPlayCheckbox && this.autoPlayCheckbox.checked && this.spinsRemaining > 0) {
      return window.setTimeout(() => this.spin(), 200);
    }

    this.config.onSpinEnd?.(symbols, winResult);
  }

  // Testing method to force a jackpot on the next spin
  forceJackpot() {
    if (this.spinsRemaining <= 0) {
      console.log("No spins remaining. Cannot force jackpot.");
      return;
    }

    // Set the force jackpot flag in the config
    this.gameConfig.forceJackpot = true;
    console.log(
      "Jackpot will be forced on the next spin! Press SPIN or wait for autoplay.",
    );

    // Flash the jackpot display to indicate it's been activated
    this.jackpotDisplay.style.color = "red";
    setTimeout(() => {
      this.jackpotDisplay.style.color = "";
    }, 1000);
  }
}

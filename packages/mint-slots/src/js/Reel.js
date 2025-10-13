import Symbol from "./Symbol.js";

export default class Reel {
  constructor(reelContainer, idx, initialSymbols, onReelEnd) {
    this.reelContainer = reelContainer;
    this.idx = idx;
    this.onReelEnd = onReelEnd;

    this.symbolContainer =
      this.reelContainer.querySelector(".icons") ||
      document.createElement("div");

    if (!this.symbolContainer.classList.contains("icons")) {
      this.symbolContainer.classList.add("icons");
    }

    if (!this.reelContainer.contains(this.symbolContainer)) {
      this.reelContainer.appendChild(this.symbolContainer);
    }

    while (this.symbolContainer.firstChild) {
      this.symbolContainer.removeChild(this.symbolContainer.firstChild);
    }

    initialSymbols.forEach((symbol) =>
      this.symbolContainer.appendChild(new Symbol(symbol).img),
    );
  }

  get factor() {
    return 1 + Math.pow(this.idx / 2, 2);
  }

  renderSymbols(nextSymbols) {
    this.lastSymbols = nextSymbols;
    const frag = document.createDocumentFragment();
    nextSymbols.forEach((key) => frag.appendChild(new Symbol(key).img));
    this.symbolContainer.appendChild(frag);
  }

  // call once to start continuous motion using normal animation
  startLoop() {
    if (this._looping) return;
    this._looping = true;

    if (this._landingTimer) { clearTimeout(this._landingTimer); this._landingTimer = null; }


    // Make sure nothing from a previous landing is still applied
    try { this._landingAnim?.cancel(); } catch {}
    this._landingAnim = null;
    this.symbolContainer.style.filter = '';
    this.symbolContainer.style.transform = 'none';
    void this.symbolContainer.offsetHeight; // reflow for safety

    this._settledResolver = null;
    this._settledPromise = null;

    // Ensure we have enough filler to travel
    const minCount = Math.max(18, Math.floor(this.factor) * 10 + 3);
    let total = this.symbolContainer.children.length;
    if (total < minCount) {
      const frag = document.createDocumentFragment();
      for (let i = 0; i < minCount - total; i++) frag.appendChild(new Symbol().img);
      this.symbolContainer.appendChild(frag);
      total = minCount;
    }

    if (!this._seamless) {
      const clone = this.symbolContainer.cloneNode(true);
      while (clone.firstChild) this.symbolContainer.appendChild(clone.firstChild);
      this._seamless = true;
      total = this.symbolContainer.children.length; // update for distance calc
    }

    // Cache symbol height & loop distance
    const first = this.symbolContainer.firstElementChild;
    let h = this._symbolHeight || 0;
    if (!h) {
      h =
        first.getBoundingClientRect().height ||
        first.offsetHeight ||
        parseFloat(getComputedStyle(first).height) || 0;
      if (!h) h = 64;
      this._symbolHeight = h;
    }
    this._loopDistance = h * (total - 3);

    // One continuous, linear animation with no gaps
    this.symbolContainer.style.willChange = 'transform';
    const loopDurationMs = Math.max(250, (this.factor || 1) * 350);
    this._loopDurationMs = loopDurationMs;
    this._loopAnim = this.symbolContainer.animate(
      [
        { transform: 'translateY(0px)' },
        { transform: `translateY(${-this._loopDistance}px)` }
      ],
      {
        duration: loopDurationMs,
        iterations: Infinity,
        easing: 'linear',
        fill: 'both',
      }
    );
  }

  async stopLoop() {
    this._looping = false;
    if (this._landingTimer) { clearTimeout(this._landingTimer); this._landingTimer = null; }
    try { this._loopAnim?.cancel(); } catch {}
    this._loopAnim = null;
    this.symbolContainer.style.willChange = '';
  }

  resolveTo(final3OrNull) {
    // If null, we simply keep looping forever (used on server error)
    if (!final3OrNull) return;

    this._pendingResult = final3OrNull;
    if (!this._settledPromise) {
      this._settledPromise = new Promise((res) => (this._settledResolver = res));
    }

    // Kick off landing now (don’t block caller)
    this._landTo(final3OrNull);
  }

  whenSettled() {
    return this._settledPromise || Promise.resolve();
  }

// --- internals ---

  _getCurrentTranslateY() {
    const cs = getComputedStyle(this.symbolContainer);
    const tr = cs.transform || 'matrix(1,0,0,1,0,0)';
    try {
      const m = new DOMMatrixReadOnly(tr);
      return m.m42; // translateY
    } catch {
      // fallback parse
      const match = tr.match(/matrix\([^,]+,[^,]+,[^,]+,[^,]+,[^,]+,([^)]+)\)/);
      return match ? parseFloat(match[1]) : 0;
    }
  }

  async _landTo(final3) {
    if (!Array.isArray(final3)) return;

    // how much later each reel starts its landing (customize as you like)
    const staggerBaseMs = (typeof this._staggerBaseMs === 'number') ? this._staggerBaseMs : 180;
    const delayMs = Math.max(0, (this.idx || 0) * staggerBaseMs);

    // If a previous landing timer exists, kill it (safety)
    if (this._landingTimer) {
      clearTimeout(this._landingTimer);
      this._landingTimer = null;
    }

    const freezeAndLand = async () => {
      // 1) Freeze at the current offset (no visual jump)
      let currentY = 0;
      if (this._loopAnim) {
        try { currentY = this._getCurrentTranslateY(); } catch {}
        try { this._loopAnim.cancel(); } catch {}
        this._loopAnim = null;
      } else {
        try { currentY = this._getCurrentTranslateY(); } catch {}
      }

      // Allow next click to start a fresh loop
      this._looping = false;
      this.symbolContainer.style.transform = `translate3d(0, ${currentY}px, 0)`;
      this.symbolContainer.style.willChange = 'transform';

      // 2) Append final symbols (keep filler intact)
      this.renderSymbols(final3);

      // 3) Compute landing target
      const h = this._symbolHeight || 64;
      const total = this.symbolContainer.children.length;
      const targetY = -h * (total - 3); // exactly where last 3 are visible

      // 4) Two-stage landing: brief carry at loop speed, then smooth decel
      const dist = targetY - currentY;
      const absDist = Math.abs(dist);

      // Estimate loop speed (px/ms)
      const loopDistance   = this._loopDistance || (h * (Math.max(18, Math.floor(this.factor) * 10 + 3) - 3));
      const loopDurationMs = this._loopDurationMs || Math.max(250, (this.factor || 1) * 350);
      const speedPxPerMs   = loopDistance / Math.max(1, loopDurationMs);

      // Time to cover remaining distance at loop speed
      const tAtSpeed = absDist / Math.max(0.001, speedPxPerMs);

      // Timing: short carry, then long decel
      const carryMs   = Math.max(80,  Math.min(220,  tAtSpeed * 0.25));
      const totalMs   = Math.max(600, Math.min(1300, tAtSpeed * 1.10));
      const carryFrac = Math.min(0.40, carryMs / totalMs);

      const midY = currentY + dist * carryFrac;

      const anim = this.symbolContainer.animate(
        [
          { offset: 0,         transform: `translate3d(0, ${currentY}px, 0)`, easing: 'linear' },
          { offset: carryFrac, transform: `translate3d(0, ${midY}px, 0)`,   easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
          { offset: 1,         transform: `translate3d(0, ${targetY}px, 0)` }
        ],
        { duration: totalMs, fill: 'forwards' }
      );
      this._landingAnim = anim;

      await anim.finished.catch(() => {});
      try { anim.commitStyles?.(); } catch {}
      try { void this.symbolContainer.offsetHeight; } catch {}
      try { anim.cancel(); } catch {}
      this._landingAnim = null;

      // 5) Normalize DOM to keep only the last 3
      const nodes = Array.from(this.symbolContainer.children);
      const last3 = nodes.slice(-3);
      this.symbolContainer.replaceChildren(...last3);

      this._seamless = false;   // allow duplication on the next startLoop

      // 6) Cleanup styles and resolve
      this.symbolContainer.style.transform = 'none';
      this.symbolContainer.style.filter = '';
      this.symbolContainer.style.willChange = '';

      const done = this._settledResolver;
      this._pendingResult = null;
      this._settledResolver = null;
      this._settledPromise = null;
      if (typeof this.onReelEnd === 'function') this.onReelEnd(this.idx);
      if (done) done();
    };

    // Keep spinning until it's your reel's turn to land
    if (this._loopAnim && delayMs > 0) {
      this._landingTimer = setTimeout(() => {
        this._landingTimer = null;
        // still looping until this exact moment
        freezeAndLand();
      }, delayMs);
    } else {
      // land immediately (e.g., first reel or no loop present)
      await freezeAndLand();
    }
  }

  async spin(opts = {}) {
    const { noTrim = false } = opts;

    // 0) Cancel leftovers so we don't stack fills
    try {
      (this.symbolContainer.getAnimations?.() || []).forEach((a) => a.cancel());
    } catch {}

    // 1) Stable height + locked viewport
    const first = this.symbolContainer.firstElementChild;
    if (!first) return;
    let h = this._symbolHeight || 0;
    if (!h) {
      h =
        first.getBoundingClientRect().height ||
        first.offsetHeight ||
        parseFloat(getComputedStyle(first).height) ||
        0;
      if (!h) h = 64;
      this._symbolHeight = h;
    }
    this.symbolContainer.style.minHeight = `${3 * h}px`;

    // 2) Buffer so a full travel is possible
    const needMin = Math.max(18, Math.floor(this.factor) * 10 + 3);
    let total = this.symbolContainer.children.length;
    if (total < needMin) {
      const frag = document.createDocumentFragment();
      for (let i = 0; i < needMin - total; i++)
        frag.appendChild(new Symbol().img);
      this.symbolContainer.appendChild(frag);
      total = needMin;
    }

    // 3) Animate
    const stepCount = total - 3;
    if (stepCount <= 0) return;
    const targetOffset = -h * stepCount;
    const duration = noTrim
      ? Math.max(250, (this.factor || 1) * 350) // short linear loops
      : (this.factor || 1) * 1000; // full smooth landing
    const easing = noTrim ? "linear" : "ease-in-out";

    const keyframes = noTrim
      ? [
          { transform: "translateY(0px)" },
          { transform: `translateY(${targetOffset}px)` },
        ]
      : [
          { transform: "translateY(0px)" },
          // softer mid-blur so icons don’t seem to “vanish”
          { filter: "blur(1px)", offset: 0.5 },
          { transform: `translateY(${targetOffset}px)`, filter: "blur(0px)" },
        ];

    this.symbolContainer.style.willChange = "transform";
    const anim = this.symbolContainer.animate(keyframes, {
      duration,
      easing,
      fill: "forwards",
    });

    this._anim = anim;
    await anim.finished.catch(() => {});

    // 4) Normalize DOM
    if (noTrim) {
      // Loop: bake last frame, rotate first -> end, then clear styles
      try {
        anim.commitStyles?.();
      } catch {}
      // Force a layout read so the browser doesn't collapse frames
      try {
        void this.symbolContainer.offsetHeight;
      } catch {}
      for (let i = 0; i < stepCount; i++) {
        const el = this.symbolContainer.firstElementChild;
        if (el) this.symbolContainer.appendChild(el);
      }
      try {
        anim.cancel();
      } catch {}
      this._anim = null;
      this.symbolContainer.style.transform = "none";
      this.symbolContainer.style.willChange = "";
      return;
    }

    // Final land: cancel anim fill first
    // Bake last frame, then normalize, then clear styles (prevents the "pop")
    try {
      anim.commitStyles?.();
    } catch {}
    try {
      void this.symbolContainer.offsetHeight;
    } catch {}
    try {
      anim.cancel();
    } catch {}
    this._anim = null;
    // keep the baked transform active until after DOM replace, then clear

    const nodes = Array.from(this.symbolContainer.children);
    const last3 = nodes.slice(-3);
    this.symbolContainer.replaceChildren(...last3);
    // Now clear styles
    this.symbolContainer.style.transform = "none";
    this.symbolContainer.style.willChange = "";

    if (!noTrim && typeof this.onReelEnd === "function") {
      this.onReelEnd(this.idx);
    }
  }
}

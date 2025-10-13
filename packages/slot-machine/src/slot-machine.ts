import type { AnimationControls } from 'motion';

export interface ReelSymbolConfig {
  title: string;
  position: number;
  weight: number;
}

export interface ReelConfig {
  imageSrc: string;
  symbols: ReelSymbolConfig[];
  element?: StripElement;
}

export interface SlotMachineOptions {
  reelHeight?: number;
  reelWidth?: number;
  reelOffset?: number;
  slotYAxis?: number;
  animSpeed?: number;
  click2Spin?: boolean;
  sounds?: {
    reelsBegin?: string;
    reelsEnd?: string;
    [key: string]: string | undefined;
  };
  rngFunc?: () => number;
}

export type SlotMachineInstance = SlotMachine;

type StripElement = HTMLElement & { animation?: AnimationControls };

export class SlotMachine {
  private container: HTMLElement;
  private reels: ReelConfig[];
  private callback?: (results: ReelSymbolConfig[]) => void;
  private options: Required<SlotMachineOptions>;
  private isAnimating = false;

  private readonly REEL_SEGMENT_TOTAL = 24;

  constructor(
    container: HTMLElement,
    reels: ReelConfig[],
    callback?: (results: ReelSymbolConfig[]) => void,
    options?: SlotMachineOptions
  ) {
    this.container = container;
    this.reels = reels;
    this.callback = callback;

    const defaults: Required<SlotMachineOptions> = {
      reelHeight: 1200,
      reelWidth: 120,
      reelOffset: 20,
      slotYAxis: 0,
      animSpeed: 1000,
      click2Spin: true,
      sounds: {},
      rngFunc: () => Math.random()
    };

    this.options = { ...defaults, ...options };

    if (this.reels.length > 0) {
      this.initGame();
    } else {
      throw new Error('Failed to initialize (missing reels)');
    }
  }

  private initGame() {
    this.container.setAttribute('aria-label', 'Slot machine');
    this.createDisplayElm();
    this.createSlotElm();
  }

  private createDisplayElm() {
    const div = document.createElement('div');
    div.classList.add('display');

    this.reels.forEach(() => {
      const elm = document.createElement('div');
      elm.classList.add('reel');
      elm.setAttribute('role', 'none');
      elm.style.transform = `rotateY(${this.options.slotYAxis}deg)`;
      elm.style.width = `${this.options.reelWidth}px`;
      div.appendChild(elm);
    });

    if (this.options.click2Spin) {
      const title = 'Click to spin';
      div.addEventListener('click', () => this.play());
      div.setAttribute('aria-label', title);
      div.setAttribute('role', 'button');
      div.setAttribute('title', title);
      div.style.cursor = 'pointer';
    }

    this.container.appendChild(div);
  }

  private createSlotElm() {
    const div = document.createElement('div');
    div.classList.add('slots');
    div.setAttribute('aria-label', 'Reels');

    this.reels.forEach((reel, index) => {
      const startPos = reel.symbols[0]?.position ?? 0;
      const elm = this.createReelElm(reel, startPos);
      elm.setAttribute('aria-label', `Reel ${index + 1}`);
      div.appendChild(elm);
    });

    this.container.appendChild(div);
  }

  private createReelElm(config: ReelConfig, startPos = 0): HTMLElement {
    const div = document.createElement('div');
    div.classList.add('reel');
    div.style.transform = `rotateY(${this.options.slotYAxis}deg)`;

    const elm = this.createStripElm(config, startPos);
    config.element = elm;
    div.appendChild(elm);

    return div;
  }

  private createStripElm(config: ReelConfig, startPos = 0): StripElement {
    const ul = document.createElement('ul') as StripElement;

    const segmentDeg = 360 / this.REEL_SEGMENT_TOTAL;
    const stripHeight = this.getStripHeight();
    const stripWidth = this.options.reelWidth;
    const transZ = Math.trunc(Math.tan(90 / Math.PI - segmentDeg) * (stripHeight * 0.5) * 4);
    const marginTop = transZ + stripHeight / 2;

    ul.style.height = `${stripHeight}px`;
    ul.style.marginTop = `${marginTop}px`;
    ul.style.width = `${stripWidth}px`;
    ul.classList.add('strip');

    for (let i = 0; i < this.REEL_SEGMENT_TOTAL; i++) {
      const li = document.createElement('li');
      const imgPosY = this.getImagePosY(i, startPos);
      const rotateX = (this.REEL_SEGMENT_TOTAL * segmentDeg) - (i * segmentDeg);
      li.style.background = `url(${config.imageSrc}) 0 ${imgPosY}px`;
      li.style.backgroundSize = `100% ${this.REEL_SEGMENT_TOTAL * 100}%`;
      li.style.height = `${stripHeight}px`;
      li.style.width = `${stripWidth}px`;
      li.style.transform = `rotateX(${rotateX}deg) translateZ(${transZ}px)`;
      ul.appendChild(li);
    }

    return ul;
  }

  private getImagePosY(index: number, position: number): number {
    return -Math.abs((this.getStripHeight() * index) + (position - this.options.reelOffset));
  }

  private getStripHeight(): number {
    return this.options.reelHeight / this.REEL_SEGMENT_TOTAL;
  }

  private selectRandSymbol(symbols: ReelSymbolConfig[]): ReelSymbolConfig {
    const totalWeight = symbols.reduce((sum, s) => sum + s.weight, 0);
    let randNum = this.options.rngFunc() * totalWeight;

    for (const symbol of symbols) {
      if (randNum < symbol.weight) return symbol;
      randNum -= symbol.weight;
    }

    const fallback = symbols[0];
    if (!fallback) {
      throw new Error('No symbols defined for reel.');
    }
    return fallback;
  }

  public play() {
    if (this.isAnimating) return;
    this.isAnimating = true;

    const payLine: ReelSymbolConfig[] = [];
    const selectedSymbols: ReelSymbolConfig[] = [];

    this.playSound(this.options.sounds.reelsBegin);

    this.reels.forEach((reel, index) => {
      const selected = this.selectRandSymbol(reel.symbols);
      const elm = reel.element;

      if (!elm) return;

      elm.classList.remove('stop');
      elm.classList.add('spin');

      elm.animation?.cancel();
      elm.animation = this.createSpinAnimation(elm);

      elm.childNodes.forEach((li, i) => {
        (li as HTMLElement).style.backgroundPositionY = `${this.getImagePosY(i, selected.position)}px`;
      });

      selectedSymbols[index] = selected;
    });

    let reelsCompleted = 0;

    this.reels.forEach((reel, index) => {
      const elm = reel.element;
      const selected = selectedSymbols[index];
      if (!elm || !selected) return;

      const delay = this.options.animSpeed * (1 + index * 0.7 + Math.random() * 0.3);

      setTimeout(() => {
        elm.classList.remove('spin');
        elm.classList.add('stop');

        elm.animation?.cancel();
        const slowdown = this.createSlowdownAnimation(elm);

        slowdown.finished.then(() => {
          const stopAnim = this.createStopAnimation(elm);
          elm.animation = stopAnim;

          stopAnim.finished.then(() => {
            payLine[index] = selected;
            this.playSound(this.options.sounds.reelsEnd);
            reelsCompleted++;

            if (reelsCompleted === this.reels.length) {
              setTimeout(() => {
                this.isAnimating = false;
                this.callback?.(payLine);
              }, 100);
            }
          });
        });

        elm.animation = slowdown;
      }, delay);
    });
  }

  private playSound(url?: string) {
    if (!url) return;
    const audio = new Audio(url);
    audio.onerror = () => console.warn(`Failed to load audio: ${url}`);
    audio.play();
  }

  private createSpinAnimation(elm: HTMLElement): AnimationControls {
    return window.Motion!.animate(elm, { rotateX: ['0deg', '360deg'] }, {
      duration: 0.5,
      repeat: Infinity,
      direction: 'reverse',
      easing: 'linear'
    });
  }

  private createSlowdownAnimation(elm: HTMLElement): AnimationControls {
    return window.Motion!.animate(elm, { rotateX: ['0deg', '10deg'] }, {
      duration: 0.1,
      easing: 'ease-out',
      direction: 'reverse',
      repeat: 1
    });
  }

  private createStopAnimation(elm: HTMLElement): AnimationControls {
    return window.Motion!.animate(
      elm,
      { rotateX: ['10deg', '0deg'] },
      window.Motion!.spring({
        stiffness: 1950,
        damping: 20,
        mass: 0.5
      })
    );
  }
}

// Global export for legacy
declare global {
  interface Window {
    slotMachine?: (
      container: HTMLElement,
      reels: ReelConfig[],
      callback?: (results: ReelSymbolConfig[]) => void,
      options?: SlotMachineOptions
    ) => SlotMachine;
    Motion?: typeof import('motion');
  }
}

if (typeof window !== 'undefined') {
  window.slotMachine = (container, reels, callback, options) =>
    new SlotMachine(container, reels, callback, options);
}

export default SlotMachine;

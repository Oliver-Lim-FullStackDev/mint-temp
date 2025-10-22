'use client';

import { useEffect, useMemo, useRef } from 'react';
import Slot from '@mint/slots';
import type { SlotGameInitDto,  SlotGameResultDto } from '@/modules/games/components/mint-slots/mint-game-slots.dto';
import '@mint/slots/slots.css';

export interface SlotsProps {
  onSpinStart?: (symbols: string[]) => void;
  onSpinEnd?: (symbols: string[], winResult: any) => void;
  onWin?: (winResult: any) => void;
  initial: SlotGameInitDto;
  result?: SlotGameResultDto['result'];
  seed?: string;
}

export default function Slots({ initial, onSpinStart, onSpinEnd, onWin, result, seed }: SlotsProps) {
  // DIV container in the DOM
  const containerRef = useRef<HTMLDivElement>(null);
  // Slot instance
  const slotInstanceRef = useRef<Slot | null>(null);
  const lastSpinSeedRef = useRef<string | undefined>(undefined);
  const pendingSpinRef = useRef<{ seed?: string; resolve?: (r: any) => void } | null>(null);

  const slotsConfig = useMemo(() => {
    return {
      inverted: false,
      gameConfig: {
        ...initial.config,
        showControls: false, // we use ours instead
      },
      onSpinStart: (symbols: string[]) => {
        console.log('onSpinStart', symbols);
        onSpinStart?.(symbols);
      },
      onSpinEnd: (symbols: string[], winResult: any) => {
        console.log('onSpinEnd', symbols);
        if (winResult?.isWin) {
          onWin?.(winResult);
          console.log('Win!', winResult);
        }
        onSpinEnd?.(symbols, winResult);
      },
      mode: 'server',
      result: undefined,
      sounds: initial.config?.sounds || undefined
    };
  }, [initial, result]);

  // 1) Instantiate and initialize on mount
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    slotInstanceRef.current = new Slot(container, slotsConfig);

    // init balances only
    slotInstanceRef.current.init({
      spinsRemaining: initial.balances.SPN,
      credits: initial.balances.SPN,
    });
  }, []);

  // 2) When a play result arrives, inject & spin
  useEffect(() => {
    const slot = slotInstanceRef.current;
    if (!slot || !seed) return;

    // New seed => start spin immediately and wait for result
    if (lastSpinSeedRef.current !== seed) {
      lastSpinSeedRef.current = seed;

      // Create a deferred promise that we resolve when 'result' for this seed arrives
      let resolve!: (r: any) => void;
      const resultPromise = new Promise<any>((r) => (resolve = r));

      // If result already present (race condition), resolve right away
      if (result) resolve(result);

      pendingSpinRef.current = { seed, resolve };

      // Kick off spinning now; Slot will loop until resultPromise resolves
      slot.spin({ resultPromise });
      return;
    }

    // Same seed updated later => resolve pending spin if result has arrived
    if (result && pendingSpinRef.current?.seed === seed && pendingSpinRef.current.resolve) {
      pendingSpinRef.current.resolve(result);
      pendingSpinRef.current = null;
    }
  }, [seed, result]);

  return (
    <div style={{ position: 'relative' }}>
      <div id="slots" ref={containerRef}>
        {/*<div id="jackpot">Jackpot: <span id="jp">0</span></div>*/}

        <div className="reels">
          <div className="reel"></div>
          <div className="reel"></div>
          <div className="reel"></div>
          <div className="reel"></div>
          <div className="reel"></div>
        </div>


        <img
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              zIndex: 10,
            }}
             src="/assets/games/minty-spins/slots-frame.png"
             alt=" "
          />

        {/*<div id="controls">
          <button type="button" id="spin">SPIN</button>
          <label>
            <input type="checkbox" name="autoplay" id="autoplay" />
            Autoplay
          </label>

          <div id="balance-info">
            <div className="balance-item">
              Spins: <span id="spins-remaining">20</span>
            </div>
            <div className="balance-item">
              Credits: <span id="credits">100</span>
            </div>
            <div className="balance-item">
              Win: <span id="win-amount">0</span>
            </div>
          </div>
        </div>

        <div id="jackpot-notification"></div>*/}
      </div>
    </div>
  );
}

'use client';

import { Text } from '@/components/core';
import { flyTo } from '@/lib/animations/fly-to';
import { useBalances, useUpdateBalanceAmount, useUpdateBalancesFromRewardObject } from '@/modules/account/session-store';
import { GamesMenu } from '@/modules/games/components/games-menu';
import { paths } from '@/routes/paths';
import { apiFetch } from '@mint/client';
import { Box, Button, Divider } from '@mint/ui/components';
import { Iconify } from '@mint/ui/components/iconify';
import Image from 'next/image';
import { useMemo, useRef, useState } from 'react';
import ReactConfetti from 'react-canvas-confetti/dist/presets/realistic';
import { flushSync } from 'react-dom';
import { useThrottledCallback } from 'use-debounce';
import { MintGameSlotsWinsTable } from './mint-game-slots-wins-table';
import { SlotGameInitDto, SlotGameResultDto } from './mint-game-slots.dto';
import Slots from './slots';

const CONFETTI_DURATION = 3000;

// TODO move Currency types in types module and use that instead
function RewardIcon({ code }: { code: 'MBX' | 'XPP' | 'RTP' }) {
  if (code === 'MBX') return <Iconify icon="mint:buck-icon" width={26} />;
  if (code === 'XPP') return <Image alt="XP" src="/assets/icons/components/ic-xp.svg" width={20} height={20} />;
  return <Iconify icon="mint:raffle-ticket-icon" width={26} />;
}

export function MintGameSlots({
  gameId,
  initial,
}: {
  gameId: string;
  initial: SlotGameInitDto;
}) {
  // Read all balances as a map { MBX, XPP, RTP, SPN, ... }
  const balances = useBalances();
  const updateBalancesFromRewardObject = useUpdateBalancesFromRewardObject();
  const updateBalanceAmount = useUpdateBalanceAmount();

  // Hold refs to the visible reward chips so we can animate from them
  const rewardRefs = useRef<Record<'MBX' | 'RTP' | 'XPP', HTMLElement | null>>({
    MBX: null,
    RTP: null,
    XPP: null,
  });

  const responseRef = useRef<SlotGameResultDto | null>(null);
  const initializedRef = useRef<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [spinKey, setSpinKey] = useState<string | undefined>(undefined);

  const spins = useMemo(
    () => {
      if (responseRef.current) {
        return responseRef.current.result?.spinsRemaining || 0;
      }

      // ensure we get init balance only once
      if (!initializedRef.current) {
        initializedRef.current = true;
        return initial?.balances.SPN || 0
      }

      if (!balances.SPN?.balanceCents) {
        return 0;
      }

      return balances.SPN?.balanceCents / 100;
    },
    [initial, responseRef.current]
  );
  const [canSpin, setCanSpin] = useState(!!spins);

  const play = useThrottledCallback(
    async () => {
      if (!canSpin) return;

      setCanSpin(false);
      setIsWin(false);

      // Make a single-use key for THIS spin and clear old result
      const key = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      responseRef.current = null;         // important: avoid resolving with previous result
      setSpinKey(key);

      setIsLoading(true);
      try {
        responseRef.current = await apiFetch(`/games/minty-spins/play`);
      } catch (err) {
        console.error('Spin failed:', err);
      } finally {
        setIsLoading(false);
      }
    },
    900,
    { leading: true, trailing: false }
  );

  const updateStoreBalances = (result: SlotGameResultDto['result']) => {
    // Update rewards using utility function
    const rewards = result?.rewards;
    if (rewards) {
      updateBalancesFromRewardObject(rewards, 1);
    }

    // SPN is absolute from server
    if (typeof result?.spinsRemaining === 'number') {
      updateBalanceAmount('SPN', result.spinsRemaining * 100);
    }
  };

  // Trigger the fly animations into the wallet targets
  const animateRewardsIntoWallet = (rewards: Partial<Record<'MBX' | 'RTP' | 'XPP', number>>) => {
    const flyTimes = 8;
    const delay = 200; // ms between launches
    const initialDelay = 1000;

    // Wait a tick so DOM has rendered the win row
    requestAnimationFrame(() => {
      (['MBX', 'RTP', 'XPP'] as const).forEach((code, i) => {
        const amount = rewards?.[code] ?? 0;
        if (!amount) return;

        window.setTimeout(() => {
          window.setTimeout(() => {
            const fromEl = rewardRefs.current[code];
            const toEl = document.querySelector<HTMLElement>(`[data-balance='${code}']`);
            if (fromEl && toEl) {
              for (let i = 0; i < flyTimes; i++) {
                window.setTimeout(() => {
                  flyTo({ from: fromEl, to: toEl });
                }, i * delay);
              }
            }
          }, i * delay);
        }, initialDelay);
      });
    });
  };

  const handleWin = () => {
    const result = responseRef.current?.result;

    // 1) Force React to commit the "win" UI synchronously
    flushSync(() => {
      setIsWin(true);
      setShowConfetti(true);
    });

    // 2) Now the reward chips are in the DOM; animate on next frame
    if (result?.rewards) {
      requestAnimationFrame(() => result.rewards && animateRewardsIntoWallet(result.rewards));
      updateStoreBalances(result);
    }

    setTimeout(() => setShowConfetti(false), CONFETTI_DURATION);
  };

  const handleSpinEnd = (symbols, winResult) => {
    setCanSpin(!!winResult?.spinsRemaining);
  }

  const { result, pf } = responseRef.current || {};
  const rewards = result?.rewards ?? null; // { MBX, RTP, XPP } | null
  const orderedCodes: Array<'MBX' | 'RTP' | 'XPP'> = ['MBX', 'RTP', 'XPP'];

  return (
    <Box position="relative">
      <GamesMenu sx={{ mb: 2 }} />

      <Slots
        initial={initial}
        result={result ?? undefined}
        onSpinStart={() => { }}
        onSpinEnd={handleSpinEnd}
        onWin={handleWin}
        seed={spinKey}
      />

      {/* Title + Totals (2-column when win) */}
      {isWin ? (
        <Box
          sx={{
            my: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Text variant="h5" color="secondary-main">You Won!</Text>

          {/* Right column with totals */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', position: 'relative', zIndex: 9999 }} onClick={() => {
            if (rewards) animateRewardsIntoWallet(rewards);
          }}>
            {rewards &&
              <>
                <Sparkles
                  color={['var(--primary-light)', 'var(--primary-lighter)', '#FFFFFF']}
                  count={30}
                  flicker={false}
                  minSize={5}
                  maxSize={14}
                  overflowPx={30}
                  fadeOutSpeed={20}
                  newSparkleOnFadeOut={true}
                />

                {orderedCodes.map((code) => {
                  const val = rewards[code] ?? 0;
                  return (
                    <Box
                      key={code}
                      sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      ref={(el: HTMLElement | null) => { rewardRefs.current[code] = el; }}
                    >
                      <RewardIcon code={code} />
                      <Text variant="body1" color="secondary-main">
                        {val}
                      </Text>
                    </Box>
                  );
                })}
              </>}
          </Box>
        </Box>
      ) : (
        <Text variant="h5" sx={{ my: 1.5 }}>
          Spin to Win!
        </Text>
      )}

      {/* CTA */}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        size="large"
        onClick={play}
        disabled={!canSpin || !spins}
      >
        <Text sx={{ fontWeight: 700 }} component="span">{(canSpin || !spins) ? 'SPIN IT!' : 'Stay Cool...'}</Text>
      </Button>

      {/* Spins remaining */}
      <Box sx={{ my: 1.5, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 1 }}>
        <Box flexGrow={1} mt="auto">
          <Text variant="body2" color="secondary" component="span" sx={{ fontWeight: 700, mr: 0.5 }}>
            {spins}
          </Text>
          <Text variant="body2" component="span">
            Spins Remaining
          </Text>
        </Box>

        <Box sx={{ width: 'auto' }}>
          <Button
            color="secondary"
            variant="contained"
            size="small"
            href={paths.store}
            startIcon={<Iconify icon="solar:cart-3-bold" />}
          >
            <Text variant="button">Get More Spins</Text>
          </Button>
        </Box>
      </Box>

      <Divider />

      <Text variant="h5" sx={{ my: 1.5 }}>
        Winning Combos & Payouts
      </Text>
      <Text variant="body2">
        Match symbols to win coins, XP, and tickets. The rarer the combo, the better the haul.
      </Text>

      <Box sx={{ my: 1.5 }}>
        <MintGameSlotsWinsTable config={initial.config.visuals} />
      </Box>

      {showConfetti && (
        <ReactConfetti
          autorun={{ speed: 0.3, duration: CONFETTI_DURATION }}
        />
      )}
      <Box sx={{ my: 2 }}>
        <RankingShareButton />
      </Box>
    </Box>
  );
}


import { RankingShareButton } from '@/modules/account/components/ranking-share-button';
import React from 'react';

// Zero-config bridge so JSX sees a real React component
type SparklesProps = {
  color?: string | string[];
  count?: number;
  minSize?: number;
  maxSize?: number;
  fadeOutSpeed?: number;
  overflowPx?: number;
  flicker?: boolean;
  newSparkleOnFadeOut?: boolean;
  style?: React.CSSProperties;
  className?: string;
};

export function Sparkles({
  children,
  style,
  className,
  ...props
}: React.PropsWithChildren<SparklesProps>) {
  // Pull default export safely even without esModuleInterop
  const Sparkle = useMemo(
    () => (require('react-sparkle').default as React.ComponentType<SparklesProps>),
    []
  );

  return (
    <Sparkle {...props} />
  );
}

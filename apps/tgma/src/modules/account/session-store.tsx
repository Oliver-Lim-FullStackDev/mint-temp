import type { PlayerAccount } from '@/types';
import type { CampaignReward } from '@/modules/missions/hooks/useMissions';
import { useStore } from 'zustand';
import { createStore } from 'zustand/vanilla';
import { useShallow } from 'zustand/react/shallow';

type SessionState = {
  // TODO add SessionResponse types into @mint/types
  session: any;
  loading: boolean;
  error: string | null;

  setLoading: (v: boolean) => void;
  setError: (msg: string | null) => void;
  setSession: (session: any) => void;
  clearSession: () => void;

  setBalance: (currency: string, next: PlayerAccount) => void;
  updateBalance: (currency: string, patch: Partial<PlayerAccount>) => void;
  replaceBalances: (balances: Record<string, PlayerAccount>) => void;

  updateBalancesFromRewards: (rewards: CampaignReward[]) => void;
  updateBalancesFromRewardObject: (rewards: Record<string, number>, multiplier?: number) => void;
  updateBalanceAmount: (currency: string, newAmount: number) => void;
};

const getBalances = (obj: any): Record<string, PlayerAccount> | null =>
  obj?.player?.balances && typeof obj.player.balances === 'object' ? obj.player.balances : null;

// 🔒 one stable empty object to avoid new snapshots
const EMPTY_BALANCES: Readonly<Record<string, PlayerAccount>> = Object.freeze({});

export const sessionStore = createStore<SessionState>()((set, get) => ({
  session: null,
  loading: false,
  error: null,

  setLoading: (v) => set({ loading: v }),
  setError: (msg) => set({ error: msg }),
  setSession: (session) => set({ session }),
  clearSession: () => set({ session: null, error: null, loading: false }),

  setBalance: (currency, next) =>
    set((s) => {
      const balances = getBalances(s.session);
      if (!balances) return s;
      return {
        session: {
          ...s.session,
          player: {
            ...s.session.player,
            balances: { ...balances, [currency]: { ...next, currency } },
          },
        },
      };
    }),

  updateBalance: (currency, patch) =>
    set((s) => {
      const balances = getBalances(s.session);
      const cur = balances?.[currency];
      if (!balances || !cur) return s;
      const next: PlayerAccount = { ...cur, ...patch, currency: patch.currency ?? cur.currency };
      return {
        session: {
          ...s.session,
          player: {
            ...s.session.player,
            balances: { ...balances, [currency]: next },
          },
        },
      };
    }),

  replaceBalances: (newBalances) =>
    set((s) => {
      const balances = getBalances(s.session);
      if (!balances) return s;
      return {
        session: {
          ...s.session,
          player: {
            ...s.session.player,
            balances: { ...newBalances },
          },
        },
      };
    }),

  updateBalancesFromRewards: (rewards) =>
    set((s) => {
      if (!rewards || rewards.length === 0) return s;

      const balances = getBalances(s.session);
      if (!balances) return s;

      const updatedBalances = { ...balances };
      rewards.forEach((reward) => {
        const currency = reward.currency;
        const currentBalance = balances[currency];

        if (currentBalance) {
          const newBalanceCents = (currentBalance.balanceCents || 0) + reward.amount;
          updatedBalances[currency] = { ...currentBalance, balanceCents: newBalanceCents };
        }
      });

      return {
        session: {
          ...s.session,
          player: {
            ...s.session.player,
            balances: updatedBalances,
          },
        },
      };
    }),

  updateBalancesFromRewardObject: (rewards, multiplier = 1) =>
    set((s) => {
      if (!rewards) return s;

      const balances = getBalances(s.session);
      if (!balances) return s;

      const updatedBalances = { ...balances };
      Object.entries(rewards).forEach(([currency, amount]) => {
        if (amount && amount > 0) {
          const currentBalance = balances[currency];

          if (currentBalance) {
            const amountInCents = amount * multiplier * 100;
            const newBalanceCents = (currentBalance.balanceCents || 0) + amountInCents;
            updatedBalances[currency] = { ...currentBalance, balanceCents: newBalanceCents };
          }
        }
      });

      return {
        session: {
          ...s.session,
          player: {
            ...s.session.player,
            balances: updatedBalances,
          },
        },
      };
    }),

  updateBalanceAmount: (currency, newAmount) =>
    set((s) => {
      const balances = getBalances(s.session);
      if (!balances) return s;

      const currentBalance = balances[currency];
      if (!currentBalance) return s;

      return {
        session: {
          ...s.session,
          player: {
            ...s.session.player,
            balances: {
              ...balances,
              [currency]: { ...currentBalance, balanceCents: newAmount }
            },
          },
        },
      };
    }),
}));

// --- React bindings (2-arg `useStore` only) ---

// Subscribe to session, loading, error with shallow equality:
export const useSession = () =>
  useStore(
    sessionStore,
    useShallow((s) => ({
      session: s.session,
      loading: s.loading,
      error: s.error,
    }))
  );

// Read a single currency balance reactively:
export const useBalance = (currency: string) =>
  useStore(sessionStore, (s) => getBalances(s.session)?.[currency]);

// All balances as a Record<string, PlayerAccount>
export const useBalances = (): Record<string, PlayerAccount> =>
  useStore(sessionStore, (s) => getBalances(s.session) ?? EMPTY_BALANCES);


export const useSetBalance = () => useStore(sessionStore, (s) => s.setBalance);

export const useUpdateBalance = () => useStore(sessionStore, (s) => s.updateBalance);

export const useReplaceBalances = () => useStore(sessionStore, (s) => s.replaceBalances);

export const useSetSession = () => useStore(sessionStore, (s) => s.setSession);

export const useClearSession = () => useStore(sessionStore, (s) => s.clearSession);

export const useSetLoading = () => useStore(sessionStore, (s) => s.setLoading);

export const useSetError = () => useStore(sessionStore, (s) => s.setError);

export const useUpdateBalancesFromRewards = () => useStore(sessionStore, (s) => s.updateBalancesFromRewards);

export const useUpdateBalancesFromRewardObject = () => useStore(sessionStore, (s) => s.updateBalancesFromRewardObject);

export const useUpdateBalanceAmount = () => useStore(sessionStore, (s) => s.updateBalanceAmount);

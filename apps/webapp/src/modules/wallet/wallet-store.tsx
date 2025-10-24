import { useStore } from 'zustand';
import { createStore } from 'zustand/vanilla';
import { useShallow } from 'zustand/react/shallow';

type WalletState = {
  showFiatValues: boolean;
  hideZeroBalances: boolean;

  setShowFiatValues: (value: boolean) => void;
  setHideZeroBalances: (value: boolean) => void;
};

export const walletStore = createStore<WalletState>()((set) => ({
  showFiatValues: false,
  hideZeroBalances: true,

  setShowFiatValues: (value) => set({ showFiatValues: value }),
  setHideZeroBalances: (value) => set({ hideZeroBalances: value }),
}));

// --- React bindings ---

export const useWalletSettings = () =>
  useStore(
    walletStore,
    useShallow((s) => ({
      showFiatValues: s.showFiatValues,
      hideZeroBalances: s.hideZeroBalances,
    }))
  );

export const useShowFiatValues = () => useStore(walletStore, (s) => s.showFiatValues);

export const useHideZeroBalances = () => useStore(walletStore, (s) => s.hideZeroBalances);

export const useSetShowFiatValues = () => useStore(walletStore, (s) => s.setShowFiatValues);

export const useSetHideZeroBalances = () => useStore(walletStore, (s) => s.setHideZeroBalances);


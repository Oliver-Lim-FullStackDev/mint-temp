'use client';

import { create } from 'zustand';

export type UIState = {
  accountDrawerOpen: boolean;
  sidebarOpen: boolean;
  navbarOpen: boolean;
  openedFromInvite: boolean;
  leaderboardSelectedTab: string;
};

type UIActions = {
  toggleAccountDrawer: () => void;
  openAccountDrawer: () => void;
  openAccountDrawerFromInvite: () => void;
  closeAccountDrawer: () => void;
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleNavbar: () => void;
  openNavbar: () => void;
  closeNavbar: () => void;
  setLeaderboardTab: (tab: string) => void;
  setInitialState: (state: Partial<UIState>) => void;
};

const defaultState: UIState = {
  accountDrawerOpen: false,
  sidebarOpen: false,
  navbarOpen: false,
  openedFromInvite: false,
  leaderboardSelectedTab: 'month',
};

export const useUIStore = create<UIState & UIActions>((set, get) => ({
  ...defaultState,

  toggleAccountDrawer: () =>
    set((s) => ({
      accountDrawerOpen: !s.accountDrawerOpen,
      openedFromInvite: false,
    })),
  openAccountDrawer: () =>
    set(() => ({ accountDrawerOpen: true, openedFromInvite: false })),
  openAccountDrawerFromInvite: () =>
    set(() => ({ accountDrawerOpen: true, openedFromInvite: true })),
  closeAccountDrawer: () =>
    set(() => ({ accountDrawerOpen: false, openedFromInvite: false })),

  toggleSidebar: () =>
    set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  openSidebar: () =>
    set(() => ({ sidebarOpen: true })),
  closeSidebar: () =>
    set(() => ({ sidebarOpen: false })),

  toggleNavbar: () =>
    set((s) => ({ navbarOpen: !s.navbarOpen })),
  openNavbar: () =>
    set(() => ({ navbarOpen: true })),
  closeNavbar: () =>
    set(() => ({ navbarOpen: false })),

  setLeaderboardTab: (tab) =>
    set(() => ({ leaderboardSelectedTab: tab })),

  setInitialState: (partial) =>
    set((s) => ({ ...s, ...partial })),
}));

'use client';

import { memo, useEffect, useRef, useState } from 'react';
import type { IconButtonProps } from '@mint/ui';
import { Box, Stack, Link, Portal } from '@mint/ui/components';
import { Scrollbar } from '@mint/ui/components/scrollbar';
import { RouterLink } from '@mint/ui/routes/components';
import { HistoryTransactions, LeadershipRanking, ProfileSummary, StreakInfo, SupportSection, TermsPrivacySection } from '@/modules/account/components';
import RankingProfileSection from '@/modules/account/components/ranking-profile-section';
import { useUserAuth } from '@/modules/telegram/context/user-auth-telegram-provider';
import { useUI } from '@/modules/ui/use-ui';
import { useTelegramBackButton } from '@/hooks/useTelegramBackButton';
import { paths } from '@/routes/paths';
import { Text } from '@/components/core';
import { AccountButton } from './account-button';


export type AccountDrawerProps = IconButtonProps & {
  onLogout?: () => void;
  portalContainer?: Element | (() => Element) | null;
  portalContainerId?: string;
};


function AccountDrawerComp({ onLogout, portalContainer, portalContainerId }: AccountDrawerProps) {
  const { accountDrawerOpen, closeAccountDrawer, openAccountDrawer } = useUI();
  const drawerRef = useRef<HTMLDivElement>(null);
  const { user, clearUser } = useUserAuth();
  const [resolvedPortalContainer, setResolvedPortalContainer] = useState<Element | null>(null);

  useEffect(() => {
    if (!portalContainerId) {
      setResolvedPortalContainer(null);
      return;
    }

    const containerElement = document.getElementById(portalContainerId);
    setResolvedPortalContainer(containerElement ?? null);
  }, [portalContainerId]);

  const handleLogout = () => {
    clearUser();
    onLogout?.();
  }

  useTelegramBackButton(accountDrawerOpen, closeAccountDrawer);

  // Close drawer when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        closeAccountDrawer();
      }
    };

    if (accountDrawerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [accountDrawerOpen, closeAccountDrawer]);

  // Lock body scroll when the drawer is open (iOS/Telegram safe)
  useEffect(() => {
    if (!accountDrawerOpen) return;

    const scrollY = window.scrollY || document.documentElement.scrollTop || 0;

    // Prevent background scroll & rubber-banding
    const prevOverflow = document.body.style.overflow;
    const prevPosition = document.body.style.position;
    const prevTop = document.body.style.top;
    const prevWidth = document.body.style.width;
    const prevOverscroll = document.body.style.overscrollBehavior;

    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overscrollBehavior = 'contain'; // dampen iOS bounce

    return () => {
      // Restore styles
      document.body.style.overflow = prevOverflow;
      document.body.style.position = prevPosition;
      document.body.style.top = prevTop;
      document.body.style.width = prevWidth;
      document.body.style.overscrollBehavior = prevOverscroll;

      // Return to previous scroll position
      window.scrollTo(0, scrollY);
    };
  }, [accountDrawerOpen]);

  return (
    <>
      <AccountButton
        openAccountDrawer={openAccountDrawer}
        photoURL={user?.profileImageUrl || user?.player?.profileImageUrl || '/mint/account-avatar-placeholder.png'}
        displayName={user?.displayName || user?.player?.username || 'Minter'}
      />

      {/* Custom drawer container */}
      {accountDrawerOpen && (
        <Portal container={(resolvedPortalContainer ?? portalContainer) ?? undefined}>
          <Box
            sx={{
              position: 'fixed',
              top: 'var(--tg-safe-top, 0px)',
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 'var(--layout-account-drawer-zIndex)',
              pointerEvents: 'auto',
            }}
          >
            {/* Backdrop */}
            <Box
              onClick={closeAccountDrawer}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                opacity: accountDrawerOpen ? 1 : 0,
                transition: 'opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
              }}
            />
            {/* Drawer content */}
            <Box
              className="HideScrollbar"
              ref={drawerRef}
              sx={{
                position: 'absolute',
                top: 0,
                left: '50%',
                height: '100%',
                pb: '56px',
                width: '100%',
                maxWidth: '440px',
                backgroundImage: [
                  'url(/assets/background/layout-background.png)',
                  // 'linear-gradient(to bottom, rgba(0,0,0,0.9) 30%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.3) 20%, transparent 50%)',
                ],
                backgroundSize: 'cover',
                backgroundRepeat: ['no-repeat', 'no-repeat'],
                backgroundColor: '#17FFE440', // Fallback color
                boxShadow: (theme) => theme.shadows[16],
                transform: accountDrawerOpen ? 'translateX(-50%)' : 'translateX(calc(-50% + 100%))',
                transition: 'transform 225ms cubic-bezier(0.0, 0, 0.2, 1) 0ms',
                overflowY: 'scroll',
              }}
            >
              <Scrollbar style={{ overflowX: "hidden" }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 1.5, pt: 1,
                    background: [
                      'linear-gradient(360deg, rgba(0, 0, 0, 0) 0%, #000000 100%)',
                      'linear-gradient(360deg, color(display-p3 0.000 0.000 0.000 / 0) 0%, color(display-p3 0.000 0.000 0.000) 100%)'
                    ],
                  }}
                >
                </Box>
                <Stack spacing={1} sx={{ p: 2.5, pt: 3 }}>
                  {/* Profile Summary Section */}
                  <ProfileSummary />

                  {/* Streak Info Section */}
                  {false && <StreakInfo />}

                  {/* Leadership Ranking */}
                 {false && <LeadershipRanking currentUser={{  // Hide temporarly
                    id: user?.id || 'current',
                    username: 'You',
                    countFriends: 120345,
                    xpRank: 42,
                    profilePicture: user?.profileImageUrl || '/mint/account-avatar-placeholder.png',
                    rank: 42
                  }}
                  />}

                  {/* Top up balances text */}
                  <Box sx={{ textAlign: 'center', py: 1 }}>
                    <Text variant="body3" color="text-primary">
                      Top up your balances by playing{' '}
                      <Link
                        onClick={closeAccountDrawer}
                        component={RouterLink}
                        href={paths.casinos.details('minty-spins')}
                        sx={{
                          color: '#00F1CB',
                          textDecoration: 'none',
                          fontWeight: 'bold',
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        Minty Spins
                      </Link>
                    </Text>
                  </Box>

                  {/* Profile Ranking List Section */}
                  <RankingProfileSection />

                  {/* History Transactions Section */}
                  <HistoryTransactions maxRows={5} />

                  {/* Support Section */}
                  <SupportSection username={user?.player?.username!} />
                </Stack>
              </Scrollbar>

              {/* Footer Section */}
              <Box sx={{ p: 2.5, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                {/* Terms & Privacy Policy */}
                <TermsPrivacySection />

                {/* TODO migrate to webapp
                <SignOutButton onClick={handleLogout} color="inherit" onClose={closeAccountDrawer} />*/}
              </Box>
            </Box>
          </Box>
        </Portal>
      )}
    </>
  );
}

export const AccountDrawer = memo(AccountDrawerComp);

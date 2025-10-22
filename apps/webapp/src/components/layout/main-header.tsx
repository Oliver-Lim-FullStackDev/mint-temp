'use client';

import { alpha, styled, useMediaQuery, useTheme } from '@mint/ui/components/core/styles';
import { Ref, useEffect, useRef, type ReactNode } from 'react';

import { AccountMenuDropdown } from '@/modules/account/components';
import {
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  Stack,
  Typography
} from '@mint/ui/components/core';
import type { IconifyName } from '@mint/ui/components/iconify';
import { Iconify } from '@mint/ui/components/iconify';
import { useDropdown } from '@mint/ui/hooks';
import PrivyAuthButton from '../auth/privy/privy-auth-button';
import { paths } from '@/routes/paths';
import { navData as mainNavData } from '@/layouts/nav-config-main';

type HeaderWallet = {
  balanceLabel?: string;
  currencyLabel?: string;
  currencyIcon?: ReactNode;
  onActionClick?: () => void;
};

type HeaderUtilityAction = {
  id: string;
  'aria-label': string;
  onClick?: () => void;
  icon?: ReactNode;
  iconName?: IconifyName;
  isDropdown?: boolean;
};

export type MainHeaderProps = {
  logo?: ReactNode;
  wallet?: HeaderWallet;
  utilityActions?: HeaderUtilityAction[];
};

function DefaultLogo() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <Box
      sx={{
        width: { xs: 36, sm: 36, lg: 80 },
        height: 20,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <img
        alt="Full logo"
        src={isMobile ? './logo/v2-single-logo.svg' : './logo/v2-full-logo.svg'}
        width="auto"
        height="40px"
      />
    </Box>
  );
}

const HeaderSurface = styled(Box)(({ theme }) => ({
  minHeight: 64,
  padding: theme.spacing(1.25, 2),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  background: 'rgba(18, 28, 38, 0.62)',
  borderRadius: Number(theme.shape.borderRadius) * 2,
  boxShadow:
    'inset 0px -1px 1px rgba(0, 0, 0, 0.25), inset 0px 1px 1px rgba(23, 255, 228, 0.25), inset 0px 4px 24px rgba(255, 255, 255, 0.08)',
  backdropFilter: 'blur(var(--layout-header-blur, 14px))',
  border: `1px solid ${alpha('#6EF2E1', 0.15)}`,
  [theme.breakpoints.up('sm')]: {
    minHeight: 72,
    padding: theme.spacing(1.5, 3),
  },
  [theme.breakpoints.up('lg')]: {
    padding: theme.spacing(2, 6),
  },
}));

const NavIconPlaceholder = styled('span')(({ theme }) => ({
  width: 20,
  height: 20,
  borderRadius: Number(theme.shape.borderRadius),
  display: 'block',
  background: 'linear-gradient(180deg, rgba(150, 154, 160, 0.4) 0%, rgba(150, 154, 160, 0.7) 100%)',
}));

const WalletContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(0.5, 1),
  borderRadius: Number(theme.shape.borderRadius) * 2,
  backgroundColor: alpha('#00F1CB', 0.14),
}));

const WalletActionButton = styled(IconButton)(({ theme }) => ({
  width: 32,
  height: 32,
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: '#00F1CB',
  boxShadow: '0px 0px 10px rgba(0, 241, 203, 0.45)',
  '&:hover': {
    backgroundColor: '#33F6DA',
  },
}));

const UtilityButton = styled(IconButton)(({ theme }) => ({
  width: 40,
  height: 40,
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha('#919EAB', 0.12),
  color: 'var(--p-contrast-text)',
  transition: theme.transitions.create(['background-color', 'transform'], {
    duration: theme.transitions.duration.short,
  }),
  '&:hover': {
    backgroundColor: alpha('#00F1CB', 0.24),
    transform: 'translateY(-1px)',
  },
}));

function DefaultWalletIcon() {
  return (
    <Avatar
      src="assets/icons/header/usdt.svg"
      sx={{
        width: 28,
        height: 28,
        borderRadius: (theme) => Number(theme.shape.borderRadius) * 1.75,
        backgroundColor: 'var(--p-dark)',
        color: 'var(--p-contrast-text)',
        fontSize: 14,
        fontWeight: 600,
      }}
    />
  );
}

function DefaultUtilityIcon() {
  return (
    <Iconify icon="mint:header-user" width={36} height={36} sx={{ fontSize: 36, color: 'inherit' }} />
  );
}

function HeaderNavItemButton({ item }) {
  const { active = window.location.pathname.includes(item.path), title, onClick } = item;

  return (
    <Box
      sx={{
        position: 'relative',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {active && (
        <Box
          sx={{
            position: 'absolute',
            top: -21,
            left: '50%',
            width: 96,
            height: 10,
            transform: 'translateX(-50%)',
            borderRadius: 999,
            background:
              'radial-gradient(50% 50% at 50% 50%, rgba(0, 241, 203, 0.5) 0%, rgba(0, 241, 203, 0) 100%)',
            pointerEvents: 'none',
          }}
        />
      )}

      <Button
        href={item.path}
        color="inherit"
        startIcon={(
          <Iconify
            icon={item.icon}
            width={20}
            height={20}
            sx={{
              color: 'inherit',
              opacity: active ? 1 : 0.72,
              transition: 'opacity 0.2s ease, color 0.2s ease',
            }}
          />
        )}
        onClick={onClick}
        sx={{
          position: 'relative',
          zIndex: 1,
          minHeight: 36,
          minWidth: 72,
          px: 1.5,
          borderRadius: (theme) => Number(theme.shape.borderRadius) * 1.5,
          gap: 1,
          textTransform: 'none',
          fontWeight: 600,
          fontSize: 14,
          lineHeight: 1.5,
          color: active ? 'var(--p-contrast-text)' : 'var(--text-secondary)',
          backgroundColor: active ? 'rgba(0, 241, 203, 0.2)' : 'transparent',
          boxShadow: active
            ? '0px 0px 16px rgba(0, 241, 203, 0.24)'
            : 'inset 0px 0px 0px 1px rgba(145, 158, 171, 0.28)',
          '&:hover': {
            backgroundColor: 'rgba(0, 241, 203, 0.18)',
            boxShadow: '0px 0px 16px rgba(0, 241, 203, 0.32)',
          },
        }}
      >
        {title}
      </Button>
    </Box>
  );
}

function HeaderWalletSummary({
  balanceLabel = '1,000,000',
  currencyIcon,
  onActionClick,
}: HeaderWallet) {
  return (
    <WalletContainer>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {currencyIcon ?? <DefaultWalletIcon />}
        </Box>
        <Typography
          variant="body2"
          sx={{ fontWeight: 600, fontSize: 15, color: '#fff', lineHeight: 1 }}
        >
          {balanceLabel}
        </Typography>
      </Stack>

      <WalletActionButton onClick={onActionClick} size="small">
        <Iconify icon="mint:header-plus" width={14} height={14} sx={{ color: '#000' }} />
      </WalletActionButton>
    </WalletContainer>
  );
}


function HeaderUtilityButton({ action, buttonRef }: { action: HeaderUtilityAction; buttonRef?: React.RefObject<HTMLDivElement> }) {
  const { onClick, icon, 'aria-label': ariaLabel } = action;

  return (
    <UtilityButton ref={buttonRef as Ref<HTMLButtonElement> | undefined} onClick={onClick} aria-label={ariaLabel}>
      {action.iconName ? (
        <Iconify
          icon={action.iconName}
          width={24}
          height={24}
          sx={{ fontSize: 24, color: 'inherit' }}
        />
      ) : (
        icon ?? <DefaultUtilityIcon />
      )}
    </UtilityButton>
  );
}

export function MainHeader({
  logo,
  wallet,
  utilityActions,
}: MainHeaderProps) {
  const { isOpen, openDialog, closeDialog, dropdownRef, triggerRef } = useDropdown();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const safeAreaTop = 'env(safe-area-inset-top, 0px)';
  const headerRef = useRef<HTMLDivElement | null>(null);

  const handleMenuClick = () => {
    openDialog();
  };

  useEffect(() => {
    const node = headerRef.current;
    if (!node || typeof window === 'undefined') {
      return;
    }

    const setHeaderHeightVar = () => {
      const height = node.offsetHeight;
      document.documentElement.style.setProperty('--layout-header-height', `${height}px`);
    };

    setHeaderHeightVar();

    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(setHeaderHeightVar)
        : undefined;

    resizeObserver?.observe(node);

    window.addEventListener('resize', setHeaderHeightVar);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener('resize', setHeaderHeightVar);
      document.documentElement.style.removeProperty('--layout-header-height');
    };
  }, []);

  const navData = mainNavData;

  // Create utility actions with access to menu handlers
  const DEFAULT_UTILITY_ACTIONS: HeaderUtilityAction[] = [
    {
      id: 'notifications',
      'aria-label': 'Open user menu',
      iconName: 'mint:header-user',
      onClick: handleMenuClick,
      isDropdown: true,
    },
  ];

  const actionsToRender =
    utilityActions && utilityActions.length > 0 ? utilityActions : DEFAULT_UTILITY_ACTIONS;

  return (
    <Box
      ref={headerRef}
      component="header"
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 'var(--layout-header-zIndex, 1200)',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          width: '100%',
          px: { xs: 1.5, sm: 3, lg: 4 },
          pt: { xs: `calc(${safeAreaTop} + 8px)`, sm: `calc(${safeAreaTop} + 16px)`, lg: `calc(${safeAreaTop} + 24px)` },
          pb: { xs: 1.5, sm: 2, lg: 3 },
          background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0) 100%)',
          display: 'flex',
          justifyContent: 'center',
          pointerEvents: 'auto',
        }}
      >
        <Container disableGutters maxWidth="xl" sx={{ width: '100%' }}>
          <HeaderSurface>
            <Box sx={{ flexShrink: 0 }}>{logo ?? <DefaultLogo />}</Box>

            <Stack
              direction="row"
              alignItems="center"
              spacing={1.5}
              sx={{
                flex: 1,
                display: { xs: 'none', sm: 'flex' },
              }}
            >
              {navData.items.map((item) => (
                <HeaderNavItemButton key={item.title} item={item} />
              ))}
            </Stack>

            <Stack
              direction="row"
              alignItems="center"
              spacing={{ xs: 1, sm: 1.5 }}
              sx={{ flexShrink: 0 }}
            >
              <HeaderWalletSummary {...(wallet ?? {})} />
              {actionsToRender.map((action) => (
                <HeaderUtilityButton
                  key={action.id}
                  action={action}
                  buttonRef={action?.isDropdown ? triggerRef as React.RefObject<HTMLDivElement> : undefined}
                />
              ))}
              <PrivyAuthButton />
            </Stack>
          </HeaderSurface>
        </Container>
      </Box>

      {/* Custom Dropdown using useDropdown hook */}
      <AccountMenuDropdown isOpen={isOpen} dropdownRef={dropdownRef} triggerRef={triggerRef} onMenuItemClick={() => closeDialog()} />
    </Box>
  );
}

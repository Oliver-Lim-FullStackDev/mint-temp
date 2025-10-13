import type { NavSectionProps } from '@mint/ui/components/nav-section';
import type { HeaderSectionProps } from '@mint/ui/minimals/layouts/core/header-section';

import { Text } from '@mint/ui/components';
import { merge } from '@mint/ui/es-toolkit';
import { HeaderSection } from '@mint/ui/minimals/layouts/core/header-section';
import { Box, Breakpoint, Button } from '@mint/ui/components/core';
import { Logo } from '@mint/ui/components/logo';
import { paths } from '@/routes/paths';
import { UIProvider } from '@/modules/ui/ui-context';
import type { LayoutSectionProps } from '@/layouts/core/layout-section';
import type { MainSectionProps } from '@/layouts/core/main-section';
import { LayoutSection } from '@/layouts/core/layout-section';
import { MainSection } from '@/layouts/core/main-section';
import { AccountDrawer } from '@/layouts/components/account-drawer';
import NavbarFooterMenu from '@/components/navbar-footer-menu';
import { NavbarHeader } from '@/components/navbar-header';
import { ACCOUNT_DRAWER_PORTAL_ID } from '@/layouts/constants';

type LayoutBaseProps = Pick<LayoutSectionProps, 'sx' | 'children' | 'cssVars'>;

export type MainLayoutProps = LayoutBaseProps & {
  layoutQuery?: Breakpoint;
  slotProps?: {
    header?: HeaderSectionProps;
    nav?: {
      data?: NavSectionProps['data'];
    };
    main?: MainSectionProps;
  };
};

export function MainLayout({
  cssVars,
  children,
  slotProps,
  layoutQuery = 'md',
}: MainLayoutProps) {
  const renderHeader = () => {
    const headerSlotProps: HeaderSectionProps['slotProps'] = {
      container: {
        maxWidth: false,
        sx: {
          pt: 'var(--tg-safe-top, 0px)',
          background: `
            linear-gradient(
              180deg,
              rgba(0,0,0,1) 0,
              rgba(0,0,0,1) var(--tg-safe-top, 0px),
              rgba(0,0,0,0) 100%
            )`,
        },
      },
    };

    const headerSlots: HeaderSectionProps['slots'] = {
      topArea: null,
      bottomArea: null,
      leftArea: (
        <>
          <Logo
            href={paths.casinos.root}
            sx={{ mr: 1, sm: { display: 'none' } }}
          />
        </>
      ),
      centerArea: (
        <Button variant="contained" color="primary" href={paths.auth.signIn}>
          <Text variant="button">Sign in</Text>
        </Button>
      ),
      rightArea: (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <NavbarHeader />
          <AccountDrawer portalContainerId={ACCOUNT_DRAWER_PORTAL_ID} />
        </Box>
      ),
    };

    return (
      <HeaderSection
        layoutQuery={layoutQuery}
        {...slotProps?.header}
        disableOffset
        disableElevation
        slots={{ ...headerSlots, ...slotProps?.header?.slots }}
        slotProps={merge(headerSlotProps, slotProps?.header?.slotProps ?? {})}
        sx={slotProps?.header?.sx || {
          // Safe on SSR: var may be absent when not in Telegram (defaults to 0)
          position: 'fixed',
          left: '50%',
          transform: 'translateX(-50%)',
          maxWidth: 440,       // match parent’s width / TODO make global and set to layouts as well
        }}
      />
    );
  };

  const renderFooter = () => null;

  const renderMain = () => (
    <MainSection
      {...slotProps?.main}
      sx={{
        ...(slotProps?.main?.sx || {}),
        paddingTop: 'calc(var(--layout-header-height, 0) + 24px)',
      }}
    >
      {children}
    </MainSection>
  );

  return (
    <UIProvider>
      <Box
        sx={{
          width: '100vw',
          maxWidth: '100vw',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'stretch',
          justifyContent: 'center',
          backgroundColor: 'black',
        }}
      >
        <Box
          sx={{
            width: '100%',
            minHeight: '100vh',
            display: 'flex',          // important: we’re a column container
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
            // Critical: page scroll, not container
            overflowX: 'hidden',
            overflowY: 'visible',
            boxSizing: 'border-box',
          }}
        >
          <LayoutSection
            headerSection={renderHeader()}
            footerSection={renderFooter()}
            cssVars={{ ...cssVars }}
          >
            {renderMain()}
          </LayoutSection>
          <NavbarFooterMenu />
          <Box
            id={ACCOUNT_DRAWER_PORTAL_ID}
            sx={{ position: 'relative', zIndex: 'var(--layout-account-drawer-zIndex)' }}
          />
        </Box>
      </Box>
    </UIProvider>
  );
}

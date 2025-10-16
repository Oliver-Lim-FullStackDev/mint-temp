import type { ComponentProps } from 'react';

import React from 'react';
import { Box } from '@mint/ui/components/core';
import { UIProvider } from '@/modules/ui/ui-context';
import type { LayoutSectionProps } from '@/layouts/core/layout-section';
import type { MainSectionProps } from '@/layouts/core/main-section';
import { LayoutSection } from '@/layouts/core/layout-section';
import { MainSection } from '@/layouts/core/main-section';
import NavbarFooterMenu from '@/components/navbar-footer-menu';
import { ACCOUNT_DRAWER_PORTAL_ID } from '@/layouts/constants';
import { MainHeader } from '@/components/layout/main-header';
import { MainFooter } from '@/components/layout/main-footer';
import { AppBackground } from '@/components/layout/app-background';

type LayoutBaseProps = Pick<LayoutSectionProps, 'sx' | 'children' | 'cssVars'>;

export type MainLayoutProps = LayoutBaseProps & {
  headerProps?: ComponentProps<typeof MainHeader>;
  footerProps?: ComponentProps<typeof MainFooter>;
  mainProps?: MainSectionProps;
};

export function MainLayout({
  cssVars,
  sx,
  children,
  headerProps,
  footerProps,
  mainProps,
}: MainLayoutProps) {
  const sectionSx = Array.isArray(sx)
    ? sx
    : sx
      ? [sx]
      : [];

  const renderHeader = () => {
    return (
      <MainHeader
        {...headerProps}
      />
    );
  };

  const renderFooter = () => (
    <MainFooter {...footerProps} />
  );

  const renderMain = () => (
    <MainSection
    {...mainProps}
      sx={{
        ...(mainProps?.sx || {}),
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
            // important: the wrapper remains a column container so the header/footer stack correctly
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
            // Critical: page scroll, not container
            overflowX: 'hidden',
            overflowY: 'visible',
            boxSizing: 'border-box',
          }}
        >
          <AppBackground />
          <LayoutSection
            headerSection={renderHeader()}
            footerSection={renderFooter()}
            cssVars={{ ...cssVars }}
            sx={[{ position: 'relative', zIndex: 1 }, ...sectionSx]}
          >
            {renderMain()}
          </LayoutSection>

          <Box
            id={ACCOUNT_DRAWER_PORTAL_ID}
            sx={{ position: 'relative', zIndex: 'var(--layout-account-drawer-zIndex)' }}
          />
        </Box>
      </Box>
    </UIProvider>
  );
}

import type { ComponentProps } from 'react';

import { AppBackground } from 'src/components/layout/app-background';
import { MainFooter } from 'src/components/layout/main-footer';
import { MainHeader } from 'src/components/layout/main-header';
import { ACCOUNT_DRAWER_PORTAL_ID } from 'src/layouts/constants';
import type { LayoutSectionProps } from 'src/layouts/core/layout-section';
import { LayoutSection } from 'src/layouts/core/layout-section';
import type { MainSectionProps } from 'src/layouts/core/main-section';
import { MainSection } from 'src/layouts/core/main-section';
import { UIProvider } from 'src/modules/ui/ui-context';
import { Box } from '@mint/ui/components/core';

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

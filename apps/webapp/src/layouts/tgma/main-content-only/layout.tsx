/* @Ported from @mint/ui */
import { Box, Breakpoint } from '@mint/ui/components';
import { UIProvider } from '@/modules/ui/ui-context';
import type { LayoutSectionProps } from '@/layouts/core/layout-section';
import type { MainSectionProps } from '@/layouts/core/main-section';
import { LayoutSection } from '@/layouts/core/layout-section';
import { MainSection } from '@/layouts/core/main-section';

type LayoutBaseProps = Pick<LayoutSectionProps, 'sx' | 'children' | 'cssVars'>;

export type MainLayoutProps = LayoutBaseProps & {
  layoutQuery?: Breakpoint;
  slotProps?: {
    main?: MainSectionProps;
  };
};

export function MainContentOnlyLayout({
  cssVars,
  children,
  slotProps,
}: MainLayoutProps) {
  const renderMain = () => <MainSection {...slotProps?.main}>{children}</MainSection>;

  return (
    <UIProvider>
      <Box
        sx={{
          width: '100vw',
          maxWidth: '100vw',
          mineight: '100vh',
          display: 'flex',
          alignItems: 'stretch',
          justifyContent: 'center',
          backgroundColor: '#000', // Dark background for areas outside mobile view
          overflow: 'hidden', // Prevent any scrolling outside the mobile container
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 440, // Mobile max width
            minHeight: '100vh',
            display: 'flex',          // important: we’re a column container
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
            // Critical: page scroll, not container
            overflowX: 'hidden',
            overflowY: 'visible',
            // Push everything down by safe-top so sticky can use top: 0
            pt: 'var(--tg-safe-top, 0px)',
            boxSizing: 'border-box',
          }}
        >
          <LayoutSection cssVars={{ ...cssVars }}>
            {renderMain()}
          </LayoutSection>
        </Box>
      </Box>
    </UIProvider>
  );
}

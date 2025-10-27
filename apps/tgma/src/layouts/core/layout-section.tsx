import type { Theme, SxProps, CSSObject } from '@mint/ui/components/core';

import Image from 'next/image';
import { Box } from '@mint/ui/components/core';
import { mergeClasses } from '@mint/ui/minimal-shared';
import { layoutClasses } from '@mint/mui/layouts/core/classes';


export type LayoutSectionProps = React.ComponentProps<'div'> & {
  sx?: SxProps<Theme>;
  cssVars?: CSSObject;
  children?: React.ReactNode;
  footerSection?: React.ReactNode;
  headerSection?: React.ReactNode;
  sidebarSection?: React.ReactNode;
};

export function LayoutSection({
  sx,
  cssVars,
  children,
  footerSection,
  headerSection,
  sidebarSection,
  className,
  ...other
}: LayoutSectionProps) {
  return (
    <>
      <Box
        id="root__layout"
        component="div"
        className={mergeClasses([layoutClasses.root, className])}
        sx={{
          width: '100%',
          minHeight: '100%',
          position: 'relative',
          overflowX: 'hidden', // Only prevent horizontal scroll
          display: 'flex',
          flexDirection: 'column',
          ...sx,
        }}
        {...other}
      >
        {/* Header: natural height */}
        {headerSection && (
          <Box sx={{ flex: '0 0 auto' }}>
            {headerSection}
          </Box>
        )}

        {/* Main content: stretches and can grow */}
        <Box sx={{ flex: '1 1 auto', minHeight: 0 }}>
          {children}
        </Box>

        {/* Footer: natural height */}
        {footerSection && (
          <Box sx={{ flex: '0 0 auto' }}>
            {footerSection}
          </Box>
        )}

        <Image
          style={{
            objectPosition: 'center',
            zIndex: -1,
          }}
          src="/assets/background/layout-background.png"
          alt=" "
          fill
          className="object-cover object-center"
          priority
        />
      </Box>
    </>
  );
}

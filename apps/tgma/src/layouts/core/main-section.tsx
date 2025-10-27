import type { SxProps, Theme } from '@mint/ui/components/core';
import { Box } from '@mint/ui/components/core';
import { mergeClasses } from '@mint/ui/minimal-shared';
import { layoutClasses } from '@mint/mui/layouts/core/classes';

export type MainSectionProps = {
  children?: React.ReactNode;
  className?: string;
  sx?: SxProps<Theme>;
  [key: string]: any;
};

export function MainSection({ children, className, sx, ...other }: MainSectionProps) {
  return (
    <Box
      component="main"
      className={mergeClasses([layoutClasses.main, className])}
      sx={{
        display: "flex",
        flex: "1 1 auto",
        flexDirection: "column",
        minHeight: '100%',
        zIndex: "var(--layout-main-section-zIndex)", // Use CSS variable for z-index
        ...sx,
      }}
      {...other}
    >
      {children}
    </Box>
  );
}

import type { SxProps, Theme } from '@mint/ui';
import { Box } from '@mint/ui/components';
import { layoutClasses } from '@mint/ui/layouts/core/classes';
import { mergeClasses } from 'minimal-shared/utils';

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

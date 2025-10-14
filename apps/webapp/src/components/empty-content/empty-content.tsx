import type { Theme, SxProps, BoxProps, TypographyProps } from '@mint/ui';

import React from 'react';
import { varAlpha } from 'minimal-shared/utils';
import { Box, Typography } from '@mint/ui/components';

import { CONFIG } from 'src/global-config';

export type EmptyContentProps = React.ComponentProps<'div'> & {
  title?: string;
  imgUrl?: string;
  filled?: boolean;
  sx?: SxProps<Theme>;
  description?: string;
  action?: React.ReactNode;
  slotProps?: {
    img?: BoxProps<'img'>;
    title?: TypographyProps;
    description?: TypographyProps;
  };
};

export function EmptyContent({
  sx,
  imgUrl,
  action,
  filled = false,
  slotProps,
  description,
  title = 'No data',
  ...other
}: EmptyContentProps) {
  const baseSx: SxProps<Theme> = {
    flexGrow: 1,
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    px: 3,
  };

  const filledSx: SxProps<Theme> = filled
    ? {
      borderRadius: (theme: Theme) => {
        const br = theme.shape.borderRadius;
        const num = typeof br === 'number' ? br : parseFloat(br as string);
        return num * 2;
      },
      backgroundColor: (theme: Theme) =>
        varAlpha(theme.vars.palette.grey['500Channel'], 0.04),
      border: (theme: Theme) =>
        `dashed 1px ${varAlpha(
          theme.vars.palette.grey['500Channel'],
          0.08
        )}`,
    }
    : {};

  const mergeSx = (propSx?: SxProps<Theme>) =>
    propSx
      ? Array.isArray(propSx)
        ? propSx
        : [propSx]
      : [];

  const imgSx = mergeSx(slotProps?.img?.sx);
  const titleSx = mergeSx(slotProps?.title?.sx);
  const descSx = mergeSx(slotProps?.description?.sx);

  return (
    <Box
      component="div"
      {...other}
      sx={[baseSx, filledSx, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}
    >
      <Box
        component="img"
        alt="Empty content"
        src={
          imgUrl ||
          `${CONFIG.assetsDir}/assets/icons/empty/ic-content.svg`
        }
        {...slotProps?.img}
        sx={[{ width: 1, maxWidth: 160 }, ...imgSx]}
      />

      {title && (
        <Typography
          variant="h6"
          {...slotProps?.title}
          sx={[
            { mt: 1, textAlign: 'center', color: 'text.disabled' },
            ...titleSx,
          ]}
        >
          {title}
        </Typography>
      )}

      {description && (
        <Typography
          variant="body2"
          {...slotProps?.description}
          sx={[
            { mt: 1, textAlign: 'center', color: 'text.disabled' },
            ...descSx,
          ]}
        >
          {description}
        </Typography>
      )}

      {action}
    </Box>
  );
}

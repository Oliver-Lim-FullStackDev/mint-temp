'use client';

import { Box, Stack, Typography } from '@mint/ui/components/core';
import { alpha, useTheme } from '@mint/ui/components/core/styles';
import type { IconifyName } from '@mint/ui/components/iconify';
import { Iconify } from '@mint/ui/components/iconify';
import React from 'react';

export interface AccountSectionProps {
  title: string;
  icon: IconifyName;
  children: React.ReactNode;
  sx?: any;
}

export const AccountSection: React.FC<AccountSectionProps> = ({
  title,
  icon,
  children,
  sx,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        background: theme.palette.background.panel,
        backdropFilter: 'blur(5x)',
        boxShadow: 'inset 0px -1px 1px rgba(0, 0, 0, 0.25), inset 0px 1px 1px rgba(23, 255, 228, 0.25), inset 0px 4px 24px rgba(255, 255, 255, 0.08)',
        border: `1px solid ${alpha('#6EF2E1', 0.15)}`,
        borderRadius: 2,

        p: 3,
        mb: 2,
        ...sx,
      }}
    >
      {/* Section Header */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.5}
        sx={{ mb: 3 }}
      >
        <Iconify
          icon={icon}
          width={24}
          height={24}
          sx={{ color: theme.palette.primary.main }}
        />
        <Typography
          variant="h6"
          sx={{
            color: theme.palette.common.white,
            fontWeight: 600,
          }}
        >
          {title}
        </Typography>
      </Stack>

      {/* Section Content */}
      <Box>
        {children}
      </Box>
    </Box>
  );
};
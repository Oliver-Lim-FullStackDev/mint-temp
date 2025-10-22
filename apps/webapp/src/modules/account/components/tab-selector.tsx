'use client';

import { Box, Button, Stack } from '@mint/ui/components/core';
import { alpha, useTheme } from '@mint/ui/components/core/styles';
import React from 'react';

export interface TabOption {
  id: string;
  label: string;
}

export interface TabSelectorProps {
  tabs: TabOption[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  sx?: any;
}

export const TabSelector: React.FC<TabSelectorProps> = ({
  tabs,
  activeTab,
  onTabChange,
  sx,
}) => {
  const theme = useTheme();

  return (
    <Box sx={sx}>
      <Box
        sx={{
          borderRadius: '10px',
          background: 'var(--background-panel, linear-gradient(90deg, var(--black-72, rgba(0, 0, 0, 0.58)) 0%, var(--black-80, rgba(0, 0, 0, 0.64)) 100%))',
          boxShadow: '0 4px 24px 0 rgba(255, 255, 255, 0.08) inset, 0 1px 1px 0 rgba(0, 255, 228, 0.25) inset, 0 -1px 1px 0 rgba(0, 0, 0, 0.25) inset, var(--z24-x, 0) var(--z24-y, 24px) var(--z24-blur, 48px) var(--z24-spread, 0) var(--shadow-16, rgba(0, 0, 0, 0.16))',
          backdropFilter: 'blur(5px)',
          p: 1,
        }}
      >
        <Stack direction="row" spacing={1}>
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant="text"
              size="small"
              onClick={() => onTabChange(tab.id)}
              sx={{
                minWidth: 'auto',
                px: 2,
                py: 0.5,
                fontSize: '0.875rem',
                fontWeight: 500,
                textTransform: 'none',
                border: 'none',
                cursor: "pointer",
                ...(activeTab === tab.id
                  ? {
                      backgroundColor: theme.palette['primary-2'].main,
                      color: theme.palette.common.white,
                      borderRadius: 1,
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                      },
                    }
                  : {
                      backgroundColor: 'transparent',
                      color: theme.palette.text.secondary,
                      borderRadius: 1,
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.common.white, 0.05),
                        color: theme.palette.primary.main,
                      },
                    }),
              }}
            >
              {tab.label}
            </Button>
          ))}
        </Stack>
      </Box>
    </Box>
  );
};
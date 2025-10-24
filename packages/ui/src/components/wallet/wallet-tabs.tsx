import type { ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material';

import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';

export interface WalletTab {
  value: number;
  label: string;
  icon: ReactNode;
}

export interface WalletTabsProps {
  tabs: WalletTab[];
  activeTab: number;
  onChange: (newValue: number) => void;
  sx?: SxProps<Theme>;
}

/**
 * Reusable wallet tabs component with GlassBox styling
 * Used for settings tabs (Wallets/Currency) and similar navigation
 */
export function WalletTabs({ tabs, activeTab, onChange, sx }: WalletTabsProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flex: '1 0 0',
        borderRadius: '12px',
        background: 'rgba(0, 0, 0, 0.80)',
        boxShadow:
          '0 4px 24px 0 rgba(255, 255, 255, 0.08) inset, 0 1px 1px 0 rgba(0, 255, 228, 0.25) inset, 0 -1px 1px 0 rgba(0, 0, 0, 0.25) inset',
        backdropFilter: 'blur(4px)',
        ...sx,
      }}
    >
      <ToggleButtonGroup
        exclusive
        value={activeTab}
        onChange={(event, newValue) => {
          if (newValue !== null) {
            onChange(newValue);
          }
        }}
        fullWidth
        sx={{
          '& .MuiToggleButtonGroup-grouped': {
            border: 'none',
            '&:not(:first-of-type)': {
              borderLeft: 'none',
            },
          },
        }}
      >
        {tabs.map((tab) => (
          <ToggleButton
            key={tab.value}
            value={tab.value}
            sx={{
              display: 'flex',
              height: '36px',
              minWidth: '64px',
              padding: '8px',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px',
              flex: '1 0 0',
              borderRadius: '8px',
              borderTop: 'none',
              background: 'transparent',
              color: '#949AA2',
              fontSize: '14px',
              fontWeight: 600,
              lineHeight: '22px',
              textTransform: 'none',
              '&.Mui-selected': {
                color: '#FFF',
                backgroundColor: '#009C79',
                borderTop: '1px solid rgba(255, 255, 255, 0.35)',
                boxShadow:
                  '0 12px 8px 0 rgba(255, 255, 255, 0.08) inset, 0 -12px 8px 0 rgba(0, 0, 0, 0.12) inset',
              },
            }}
          >
            {tab.icon}
            {tab.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
}


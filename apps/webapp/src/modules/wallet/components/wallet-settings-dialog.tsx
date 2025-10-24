'use client';

import { useState } from 'react';
import { Box, IconButton, Stack, Tabs, Tab } from '@mint/ui/components/core';
import { GlassDialog, Text } from '@mint/ui/components';
import { Iconify } from '@mint/ui/components/iconify';
import { useSession } from '@/modules/account/session-store';
import { WalletSettingsList } from '@/modules/wallet/components/wallet-settings-list';
import { CurrencySelector } from '@/modules/wallet/components/currency-selector';

interface WalletSettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

export function WalletSettingsDialog({ open, onClose }: WalletSettingsDialogProps) {
  const { session } = useSession();
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleBack = () => {
    onClose();
  };

  return (
    <GlassDialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          p: 0,
          maxWidth: 420,
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          boxSizing: 'border-box',
          position: 'relative',
        }
      }}
    >
      {/* Header */}
      <Box
        sx={{
          position: 'relative',
          p: 3,
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Back button */}
        <IconButton
          onClick={handleBack}
          sx={{
            position: 'absolute',
            left: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            color: '#fff',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.2)',
            },
          }}
        >
          <Iconify icon="mint:arrow-left" width={16} height={16} />
        </IconButton>

        {/* Title */}
        <Text
          variant="h4"
          sx={{
            color: '#fff',
            textAlign: 'center',
          }}
        >
          Settings
        </Text>

        {/* Close button */}
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            color: '#fff',
            fontSize: '18px',
            fontWeight: 'bold',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.2)',
            },
          }}
        >
          ×
        </IconButton>
      </Box>

      {/* Tabs */}
      <Box sx={{ px: 3, pt: 2 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: '#00F1CB',
              height: 3,
              borderRadius: '2px',
            },
            '& .MuiTab-root': {
              color: 'rgba(255, 255, 255, 0.6)',
              fontWeight: 600,
              fontSize: '16px',
              textTransform: 'none',
              minHeight: 48,
              '&.Mui-selected': {
                color: '#00F1CB',
              },
            },
          }}
        >
          <Tab
            icon={<Iconify icon="mint:header-wallet" width={20} height={20} />}
            iconPosition="start"
            label="Wallets"
            id="settings-tab-0"
            aria-controls="settings-tabpanel-0"
          />
          <Tab
            icon={<Iconify icon="mint:currency" width={20} height={20} />}
            iconPosition="start"
            label="Currency"
            id="settings-tab-1"
            aria-controls="settings-tabpanel-1"
          />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <Box sx={{ px: 3, pb: 3 }}>
        <TabPanel value={activeTab} index={0}>
          <WalletSettingsList />
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          <CurrencySelector />
        </TabPanel>
      </Box>
    </GlassDialog>
  );
}

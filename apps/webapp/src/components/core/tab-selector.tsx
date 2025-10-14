import { Box, Tab, Tabs } from '@mui/material';
import React from 'react';
import { Text } from './text';

export interface TabOption {
  id: string;
  label: string;
  value: string;
}

export interface TabSelectorProps {
  options: TabOption[];
  selectedValue?: string;
  onSelectionChange: (option: TabOption) => void;
  isWide?: boolean;
}



export const TabSelector: React.FC<TabSelectorProps> = ({
  options,
  selectedValue,
  onSelectionChange,
  isWide = false,
}) => {
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    const selectedOption = options.find(option => option.value === newValue);
    if (selectedOption) {
      onSelectionChange(selectedOption);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs
        value={selectedValue || options[0]?.value}
        onChange={handleChange}
        variant={isWide ? "fullWidth" : "scrollable"}
        scrollButtons="auto"
        sx={{
          minHeight: 'auto',
          '& .MuiTabs-indicator': {
            backgroundColor: 'var(--brand-primary-blue-main)',
            height: 2,
            borderRadius: '1px 1px 0 0',
          },
          '& .MuiTabs-flexContainer': {
            gap: isWide ? '0px' : '32px',
            ...(isWide && {
              width: '100%',
              justifyContent: 'space-between',
            }),
          },
          '& .MuiTabs-scroller': {
            overflowX: 'auto !important',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
          },
          '& .MuiTabs-scrollButtons': {
            '&.Mui-disabled': {
              opacity: 0.3,
            },
          },
        }}
      >
        {options.map((option) => (
          <Tab
            key={option.id}
            value={option.value}
            sx={{
              minHeight: 'auto',
              padding: '0 0 12px 0',
              minWidth: 'auto',
              textTransform: 'none',
              fontSize: '16px',
              fontWeight: 600,
              lineHeight: '24px',
              color: '#969AA0',
              fontFamily: 'Red Hat Text',
              cursor: 'pointer',
              ...(isWide && {
                flex: 1,
                maxWidth: 'none',
                textAlign: 'center',
              }),
              '&.Mui-selected': {
                color: '#FFFFFF',
              },
              '&:hover': {
                color: '#FFFFFF',
                opacity: 0.8,
              },
              '& .MuiTab-wrapper': {
                alignItems: isWide ? 'center' : 'flex-start',
              },
            }}
            label={
              <Text
                variant="subtitle1"
                color={selectedValue === option.value ? 'text-primary' : 'text-secondary'}
                sx={isWide ? { textAlign: 'center' } : {}}
              >
                {option.label}
              </Text>
            }
          />
        ))}
      </Tabs>
    </Box>
  );
};

export default TabSelector;
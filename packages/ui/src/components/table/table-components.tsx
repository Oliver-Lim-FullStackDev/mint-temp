import type { ComponentType } from 'react';

import { Box, styled, TableContainer } from '@mui/material';

// Types
export type TabType = 'game_play' | 'purchases';

// Props types
export interface StyledTableContainerProps {
  children: React.ReactNode;
}

export interface TabButtonProps {
  active: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

// Styled Components
export const StyledTableContainer: ComponentType<StyledTableContainerProps> = styled(TableContainer)(({ theme }) => ({
  backgroundColor: 'transparent',
  '& .MuiTable-root': {
    '& .MuiTableCell-root': {
      borderColor: 'rgba(255, 255, 255, 0.1)',
      color: '#969AA0',
      padding: theme.spacing(1, 2),
    },
    '& .MuiTableHead-root .MuiTableCell-root': {
      backgroundColor: 'transparent',
      fontWeight: 'bold',
      fontSize: '0.75rem',
      color: 'white',
    },
    '& .MuiTableBody-root .MuiTableRow-root:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
  },
}));

export const TabButton: ComponentType<TabButtonProps & { active: boolean }> = styled(Box)<{ active: boolean }>(({ theme, active }) => ({
  padding: theme.spacing(1, 2),
  cursor: 'pointer',
  color: active ? 'white' : '#969AA0',
  fontWeight: active ? 'bold' : 'normal',
  borderBottom: active ? '2px solid #00F1CB' : '2px solid transparent',
  transition: 'all 0.2s ease',
  '&:hover': {
    color: 'white',
  },
}));


'use client';

import { useUIStore } from 'src/modules/ui/ui-store';
import { paths } from 'src/routes/paths';
import { Box } from '@mint/ui/components/core';
import { useTheme } from '@mint/ui/components/core/styles';
import { useRouter } from 'next/navigation';
import React from 'react';
import AccountMenuListItem from './account-menu-list-item';

export interface UserMenuListProps {
  isOpen: boolean;
  onMenuItemClick?: (action: string) => void;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  triggerRef?: React.RefObject<HTMLElement | null>;
}

export interface MenuItemData {
  id: string;
  label: string;
  icon: string;
  action: string;
  showDividerAfter?: boolean;
}

export const AccountMenuDropdown: React.FC<UserMenuListProps> = ({ isOpen, onMenuItemClick, dropdownRef, triggerRef }) => {
  const theme = useTheme();
  const router = useRouter();
  const { setAccountTab } = useUIStore();
  const [position, setPosition] = React.useState({ top: 1000, left: 1000 }); // Hidden State

  React.useEffect(() => {
    if (isOpen && triggerRef?.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: triggerRect.bottom + 8,
        left: triggerRect.left,
      });
    }
  }, [isOpen, triggerRef]);

  const handleMenuItemClick = (action: string) => {
    // Handle navigation for account-related items
    switch (action) {
      case 'account':
        setAccountTab('account');
        router.push(paths.account);
        break;
      case 'affiliate':
        setAccountTab('affiliate');
        router.push(paths.account);
        break;
      case 'transactions':
        setAccountTab('transactions');
        router.push(paths.account);
        break;
      default:
        // For other actions (live-support, help-center, logout), use the original callback
        if (onMenuItemClick) {
          onMenuItemClick(action);
        }
        break;
    }
  };

  const menuItems: MenuItemData[] = [
    {
      id: 'account',
      label: 'Account',
      icon: 'account-dropdown:mint-icon',
      action: 'account',
    },
    {
      id: 'affiliate',
      label: 'Affiliate',
      icon: 'affiliate-dropdown:mint-icon',
      action: 'affiliate',
    },
    {
      id: 'transactions',
      label: 'Transactions',
      icon: 'transactions-dropdown:mint-icon',
      action: 'transactions',
      showDividerAfter: true,

    },
    {
      id: 'live-support',
      label: 'Live Support',
      icon: 'live-support-dropdown:mint-icon',
      action: 'live-support',

    },
    {
      id: 'help-center',
      label: 'Help Center',
      icon: 'help-center-dropdown:mint-icon',
      action: 'help-center',
      showDividerAfter: true,
    },
    {
      id: 'logout',
      label: 'Logout',
      icon: 'logout-dropdown:mint-icon',
      action: 'logout',
    },
  ];
  return isOpen ? (
    <Box
      ref={dropdownRef}
      sx={{
        position: 'fixed',
        top: triggerRef ? position.top : { xs: 80, sm: 88, lg: 96 },
        left: triggerRef ? position.left : 'auto',
        right: triggerRef ? 'auto' : { xs: 48, sm: 96, lg: 128 },
        zIndex: 'var(--layout-modal-zIndex, 10003)',
        minWidth: 220,
        // TODO fix ts errors
        // @ts-ignore
        background: theme.palette.primary.darker,
        borderRadius: 2,
        // TODO fix ts errors
        // @ts-ignore
        boxShadow: theme.vars?.customShadows.z24,
        p: 1.5,
      }}
    >
      {menuItems.map((item) => (
        <React.Fragment key={item.id}>
          <AccountMenuListItem item={item} onMenuItemClick={handleMenuItemClick} />
        </React.Fragment>
      ))}
    </Box>
  ): null;
};

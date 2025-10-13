'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { paths } from '@/routes/paths';
import { Box, Stack } from '@mint/ui/components/core';
import { GlassBox, Text } from '@mint/ui/components'
import { Iconify } from '@mint/ui/components/iconify';

interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon: string;
}

const menuItems: MenuItem[] = [
  {
    id: 'store',
    label: 'Store',
    path: paths.store,
    icon: 'navbar-footer-menu:mint-store-icon',
  },
  {
    id: 'rankings',
    label: 'Rankings',
    path: paths.rankings,
    icon: 'navbar-footer-menu:mint-ranking-icon',
  },
  {
    id: 'play-win',
    label: 'Play & Win',
    path: paths.casinos.root,
    icon: 'navbar-footer-menu:play-win-icon',
  },
  {
    id: 'earn',
    label: 'Earn',
    path: paths.earn,
    icon: 'navbar-footer-menu:earn-icon',
  },
  {
    id: 'drops',
    label: '$MINT',
    path: "/drops",
    icon: 'navbar-footer-menu:mint-buck-icon',
  },
];

export default function NavbarFooterMenu() {
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const selectedItem = getActiveMenuItem(pathname);

  return (
    <Box
      sx={{
        position: 'fixed',   // stays on screen
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)', // center
        width: '100%',
        maxWidth: 440,       // match parent’s width / TODO make global and set to layouts as well
        px: 2,               // 16px left/right padding (MUI spacing = 8px * 2)
        zIndex: 'var(--layout-footer-menu-zIndex)',
      }}
    >
      <GlassBox
        variant="glass"
        sx={{
          borderRadius: '16px',
          p: '2px',
          height: 63,
          backdropFilter: 'blur(20px)',
          background: 'rgba(22, 28, 36, 0.8)',
          border: 'nonce',
          boxShadow: [
            '0px 8px 32px rgba(0, 0, 0, 0.4)',
            '0px 1px 1px rgba(23, 255, 228, 0.25) inset',
            '0px 4px 24px rgba(255, 255, 255, 0.08) inset'
          ].join(', '),
          width: '100%',
        }}
      >
        <Stack
          display="flex"
          justifyContent="space-between"
          direction="row"
          spacing={0}
          alignItems="center"
          sx={{
            height: 63,
            mx: 0.5,
            width: 'calc(100% - 8px)'
          }}
        >
          {menuItems.map((item, index) => {
            const isSelected = selectedItem === item.id;
            const isHovered = hoveredItem === item.id;
            const isActive = isSelected || isHovered;

            return (
              <Link key={item.id} href={item.path} passHref style={{ textDecoration: 'none', flex: 1, width: '100%' }}>
                <Box
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  sx={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1,
                    width: '100%',
                    height: '55px',
                    borderRadius: { xs: '12px', sm: '16px' },
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    py: { xs: 0.25, sm: 0.5 },
                    px: '6px',
                    background: isActive
                      ? 'rgba(0, 249, 199, 0.08)'
                      : 'transparent',
                    backdropFilter: isActive
                      ? 'blur(4px)'
                      : 'none',
                    border: 'none',
                    boxShadow: isActive
                      ? [
                        '0px 4px 24px rgba(255, 255, 255, 0.08) inset',
                        '0px 1px 1px rgba(0, 255, 228, 0.25) inset',
                        '0px -1px 1px rgba(0, 0, 0, 0.25) inset'
                      ].join(', ')
                      : 'none',
                    transform: isActive ? 'translateY(-2px)' : 'translateY(0)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  {/* Icon */}
                  <Iconify
                    icon={item.icon}
                    sx={{
                      width: 24,
                      height: 24,
                      color: isActive
                        ? 'var(--brand-primary-blue-main)'
                        : 'rgba(255, 255, 255, 0.7)',
                      transition: 'all 0.2s ease',
                      mb: '4px',
                    }}
                  />

                  {/* Label */}
                  <Text
                    variant="caption"
                    color={isSelected ? 'primary-blue-main' : 'rgba(255, 255, 255)'}
                    sx={{
                      fontWeight: 600,
                      transition: 'all 0.2s ease',
                      textAlign: 'center',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.label}
                  </Text>
                </Box>
              </Link>
            );
          })}
        </Stack>
      </GlassBox>
    </Box>
  );
}
// Function to determine the active menu item based on current pathname
const getActiveMenuItem = (currentPath: string): string => {
  // Handle exact matches first
  if (currentPath === '/mint') return 'mint';
  if (currentPath === '/drops') return 'drops';

  // Handle casinos routes (including dynamic routes like /casinos/[game])
  if (currentPath.startsWith('/casinos')) return 'play-win';

  // Handle other exact matches
  if (currentPath === '/store') return 'store';
  if (currentPath === '/rankings') return 'rankings';
  if (currentPath === '/earn') return 'earn';

  // Handle nested routes with startsWith for future extensibility
  if (currentPath.startsWith('/store')) return 'store';
  if (currentPath.startsWith('/rankings')) return 'rankings';
  if (currentPath.startsWith('/earn')) return 'earn';

  // Default to 'mint' for unmatched routes
  return 'mint';
};

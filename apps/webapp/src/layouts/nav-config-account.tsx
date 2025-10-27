import { Iconify } from '@mint/ui/components/iconify';

import type { AccountDrawerProps } from '@mint/mui/layouts/components/account-drawer';

// ----------------------------------------------------------------------

export const _account: AccountDrawerProps['data'] = [
  { label: 'Home', href: '/', icon: <Iconify icon="solar:home-angle-bold-duotone" /> },
  {
    label: 'Profile',
    href: '#',
    icon: <Iconify icon="custom:profile-duotone" />,
  },
  {
    label: 'Wallets',
    href: '#',
    icon: <Iconify icon="solar:notes-bold-duotone" />,
    info: '3',
  },
  {
    label: 'Withdrawals',
    href: '#',
    icon: <Iconify icon="custom:invoice-duotone" />,
  },
  { label: 'Referrals', href: '#', icon: <Iconify icon="solar:shield-keyhole-bold-duotone" /> },
  { label: 'Account settings', href: '#', icon: <Iconify icon="solar:settings-bold-duotone" /> },
];

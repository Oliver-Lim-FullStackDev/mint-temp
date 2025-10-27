import { AuthSplitLayout } from '@mint/mui/layouts/auth-split';

import { GuestGuard } from '@mint/mui/auth/guard';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <GuestGuard>
      <AuthSplitLayout
        slotProps={{
          section: { title: 'Sign in' },
        }}
      >
        {children}
      </AuthSplitLayout>
    </GuestGuard>
  );
}

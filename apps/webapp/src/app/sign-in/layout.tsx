import { AuthSplitLayout } from '@mint/ui/minimals/layouts/auth-split';

import { GuestGuard } from '@mint/ui/minimals/auth/guard';

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

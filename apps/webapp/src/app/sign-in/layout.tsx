import { AuthSplitLayout } from '@mint/ui/layouts/auth-split';

import { GuestGuard } from '@mint/ui/auth/guard';

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

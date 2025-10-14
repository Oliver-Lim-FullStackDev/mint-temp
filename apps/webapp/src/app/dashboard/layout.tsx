import { AuthGuard } from '@/components/auth/auth-guard';
import { ServerMainLayout } from '@/layouts/tgma/main/layout.server';

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <AuthGuard>
      <ServerMainLayout>{children}</ServerMainLayout>
    </AuthGuard>
  );
}

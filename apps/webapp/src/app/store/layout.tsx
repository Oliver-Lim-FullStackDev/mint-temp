import { ServerMainLayout } from '@/layouts/web/main/layout.server';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ServerMainLayout>{children}</ServerMainLayout>;
}

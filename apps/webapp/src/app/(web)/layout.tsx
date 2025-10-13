import { ServerMainLayout } from '@/layouts/web/main/layout.server';

type Props = {
  children: React.ReactNode
};

export default async function Layout({ children }: Props) {
  return <ServerMainLayout>{children}</ServerMainLayout>;
}

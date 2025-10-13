import { ServerMainLayout } from '@/layouts/tgma/main/layout.server';

type Props = {
  children: React.ReactNode
};

export default function Layout({ children }: Props) {
  return <ServerMainLayout>{children}</ServerMainLayout>;
}

import { MainLayout } from '@/layouts/web/main/layout';

type Props = {
  children: React.ReactNode
};

export default function Layout({ children }: Props) {
  return <MainLayout>{children}</MainLayout>;
}

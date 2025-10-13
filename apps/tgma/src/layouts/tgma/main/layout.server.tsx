import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { paths } from '@/routes/paths';
import type { MainLayoutProps } from './layout';
import { MainLayout } from './layout';

export type ServerMainLayoutProps = MainLayoutProps & {
  withLayoutBackground?: boolean;
};

export async function ServerMainLayout({
  ...props
}: ServerMainLayoutProps) {
  return <MainLayout {...props} />;
}

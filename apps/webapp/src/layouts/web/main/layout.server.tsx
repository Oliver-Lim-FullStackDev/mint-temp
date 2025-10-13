import type { MainLayoutProps } from './layout';
import { MainLayout } from './layout';

export type ServerMainLayoutProps = MainLayoutProps & {
  withLayoutBackground?: boolean;
};

export async function ServerMainLayout(props: ServerMainLayoutProps) {
  return <MainLayout {...props} />;
}

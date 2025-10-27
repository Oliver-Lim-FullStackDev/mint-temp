import React from 'react';
import { ServerMainLayout } from 'src/layouts/tgma/main/layout.server';

type Props = {
  children: React.ReactNode
};
export default function Layout({ children }: Props) {
  return <ServerMainLayout withLayoutBackground>{children}</ServerMainLayout>;
}

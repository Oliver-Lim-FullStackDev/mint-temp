import React from 'react';
import { ServerMainLayout } from '@/layouts/web/main/layout.server';

type NextLayoutProps = import('.next/types/app/(web)/layout').LayoutProps;

export default async function Layout({ children }: NextLayoutProps) {
  return <ServerMainLayout>{children}</ServerMainLayout>;
}

import React from 'react';
import { ServerMainLayout } from '@/layouts/tgma/main/layout.server';

type NextLayoutProps = import('.next/types/app/(web)/layout').LayoutProps;

export default function Layout({ children }: NextLayoutProps) {
  return <ServerMainLayout>{children}</ServerMainLayout>;
}

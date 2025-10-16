import React from 'react';
import { ServerMainLayout } from '@/layouts/tgma/main/layout.server';

export default async function Layout({ children }: { children: React.ReactNode }) {
  return <ServerMainLayout>{children}</ServerMainLayout>;
}

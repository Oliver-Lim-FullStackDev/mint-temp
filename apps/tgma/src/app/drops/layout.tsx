import React from 'react';
import { ServerMainLayout } from 'src/layouts/tgma/main/layout.server';

export default async function Layout({ children }: { children: React.ReactNode }) {
  return <ServerMainLayout>{children}</ServerMainLayout>;
}

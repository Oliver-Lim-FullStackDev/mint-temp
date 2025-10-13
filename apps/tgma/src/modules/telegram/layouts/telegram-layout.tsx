import type { ReactNode } from 'react';
import { SxProps, Theme } from '@mint/ui/components/core';
import { MainLayout } from '@/layouts/tgma/main/layout';

interface TelegramLayoutProps {
  children: ReactNode;
  sx?: SxProps<Theme>;
}

export default function TelegramLayout({ children, sx }: TelegramLayoutProps) {
  return (
    <MainLayout
      sx={{
        background: "transparent url('/assets/background/telegram-bg.png') center center / cover no-repeat fixed",
        backgroundOpacity: 0.5,
        ...sx,
      }}
    >
      {children}
    </MainLayout>
  );
}

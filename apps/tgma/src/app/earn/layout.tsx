import React from 'react';
import TelegramLayout from 'src/modules/telegram/layouts/telegram-layout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <TelegramLayout>{children}</TelegramLayout>;
}

import React from 'react';
import { TelegramWrapper } from 'src/modules/telegram/components/telegram-wrapper';
import { TelegramGuard } from './TelegramGuard';
import { HomeView } from './view';

export default function TgmaPage() {
  return (
    <TelegramWrapper>
      <TelegramGuard>
        <HomeView />
      </TelegramGuard>
    </TelegramWrapper>
  );
}

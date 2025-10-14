import type { WebApp as TelegramWebApp } from '@twa-dev/types';

declare global {
  interface Window {
    Telegram: {
      WebApp: TelegramWebApp;
    };
  }
}

export {}; // Ensure it's a module

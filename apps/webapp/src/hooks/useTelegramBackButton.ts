'use client';

import { useEffect } from 'react';
import { on, off } from '@telegram-apps/bridge';
import WebApp from '@twa-dev/sdk';

export function useTelegramBackButton(
  isActive: boolean,
  onBack: () => void
) {
  useEffect(() => {
    if (!isActive) {
      return;
    }

    const handleBack = () => {
      onBack();
      WebApp.BackButton.hide();
    };

    const init = async () => {
      // Subscribe to the raw Desktop/Mobile bridge event
      on('back_button_pressed', handleBack);
      WebApp.BackButton.show();
    }

    init();

    return () => {
      off('back_button_pressed', handleBack);
      WebApp.BackButton.hide();
    };
  }, [isActive, onBack]);
}

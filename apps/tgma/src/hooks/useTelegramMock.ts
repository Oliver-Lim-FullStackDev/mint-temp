import { useClientOnce } from 'src/hooks/useClientOnce';
import {
  isTMA,
  mockTelegramEnv,
  retrieveLaunchParams,
  type LaunchParams,
} from '@telegram-apps/sdk-react';

/**
 * Mocks Telegram environment in development mode if enabled.
 */
export function useTelegramMock(enabled = true): void {
  useClientOnce(() => {
    if (!enabled) return;

    const isDev = process.env.NODE_ENV === 'development';

    // Skip mocking if it's already a real Telegram environment
    if (!isDev || (sessionStorage.getItem('env-mocked') && isTMA())) {
      return;
    }

    let lp: LaunchParams | undefined;

    try {
      lp = retrieveLaunchParams();
    } catch (e) {
      const data = new URLSearchParams([
        ['user', JSON.stringify({
          id: 99281932,
          first_name: 'Mint',
          last_name: 'DotIO',
          username: 'rogue',
          language_code: 'en',
          is_premium: true,
          allows_write_to_pm: true,
        })],
        ['hash', '89d6079ad6762351f38c6dbbc41bb53048019256a9443988af7a48bcad16ba31'],
        ['auth_date', '1716922846'],
        ['start_param', 'debug'],
        ['chat_type', 'sender'],
        ['chat_instance', '8428209589180549439'],
        ['signature', '6fbdaab833d39f54518bd5c3eb3f511d035e68cb'],
      ]);

      const themeParams: LaunchParams['tgWebAppThemeParams'] = {
        accent_text_color: '#6ab2f2',
        bg_color: '#17212b',
        button_color: '#5288c1',
        button_text_color: '#ffffff',
        destructive_text_color: '#ec3942',
        header_bg_color: '#17212b',
        hint_color: '#708499',
        link_color: '#6ab3f3',
        secondary_bg_color: '#232e3c',
        section_bg_color: '#17212b',
        section_header_text_color: '#6ab3f3',
        subtitle_text_color: '#708499',
        text_color: '#f5f5f5'
      };

      const mockParams: Parameters<typeof mockTelegramEnv>[0] = {
        launchParams: {
          tgWebAppData: data,
          tgWebAppVersion: '8.0',
          tgWebAppPlatform: 'tdesktop',
          tgWebAppThemeParams: themeParams,
        },
      };

      mockTelegramEnv(mockParams);
    }

    sessionStorage.setItem('env-mocked', '1');

    console.warn(
      '⚠️ Telegram environment was mocked for development. This will NOT apply in production builds. Disable this in production to avoid app crashes outside Telegram.'
    );
  });
}

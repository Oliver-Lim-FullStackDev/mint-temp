import {
  init as initSDK,
  setDebug,
  backButton,
  viewport,
  themeParams,
  miniApp,
  initData,
} from '@telegram-apps/sdk-react';

export async function init(debug: boolean): Promise<void> {
  // Enable SDK debug logs (events in/out)
  setDebug(debug);

  // Configure SDK globals (launch params, postEvent, etc.)
  initSDK();

  // Back button
  if (backButton.isSupported() && backButton.mount?.isAvailable()) {
    backButton.mount();
  }

  // v3: mount these synchronously
  if (themeParams.mountSync?.isAvailable()) themeParams.mountSync();
  if (miniApp.mountSync?.isAvailable()) miniApp.mountSync();

  // Restore init data state
  initData.restore();

  // Viewport: async mount, then expose CSS vars
  if (viewport.mount?.isAvailable()) {
    try {
      if (!viewport.isMounting()) {
        await viewport.mount();
      }
      if (viewport.bindCssVars?.isAvailable()) {
        viewport.bindCssVars();
      }
    } catch (e) {
      console.error('Viewport mount failed', e);
    }
  }

  // Let Telegram know UI is ready (hides placeholder)
  if (miniApp.ready?.isAvailable()) miniApp.ready();

  // Optional: in-app console
  if (debug) {
    try {
      const eruda = (await import('eruda')).default;
      eruda.init();
    } catch (e) {
      console.error(e);
    }
  }
}

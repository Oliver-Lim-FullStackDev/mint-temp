// @ts-nocheck
import { useMemo } from 'react';
import { retrieveLaunchParams } from '@telegram-apps/sdk-react';

/**
 * Retrieves Mini Apps launch parameters.
 */
export function useLaunchParams(camelCase?: boolean) {
  return useMemo(() => {
    try {
      const lp = retrieveLaunchParams(camelCase);
      // lp.startParam -> "ref=98765&referrer=mint.partner&user_id=123456&..."
      const usp = new URLSearchParams(lp.startParam ?? "");
      return { searchParams: usp, raw: lp.startParam, initData: lp.initData };
    } catch (error: unknown) {
      return {};
    }
  }, []);
}

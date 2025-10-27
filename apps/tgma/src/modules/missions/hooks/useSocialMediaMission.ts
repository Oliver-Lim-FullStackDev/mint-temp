import { useCallback } from 'react';
import { useOptInCampaign } from './useMissions';
import { useUpdateBalance, useBalances, useUpdateBalancesFromRewards } from 'src/modules/account/session-store';
import {
  shouldUseSocialMediaWorkflow,
  getPlatformFromCampaignKey,
  getSocialMediaConfig as getConfigFromConfig,
  SocialNetwork,
  SocialPlatformConfig
} from '../config/social-media-config';

export interface SocialMediaConfig extends SocialPlatformConfig {
  platform: SocialNetwork;
}

export function useSocialMediaMission() {
  const optInMutation = useOptInCampaign();
  const updateBalance = useUpdateBalance();
  const balances = useBalances();
  const updateBalancesFromRewards = useUpdateBalancesFromRewards();

  const isSocialMediaMission = useCallback((campaignKey: string): boolean => {
    return shouldUseSocialMediaWorkflow(campaignKey);
  }, []);

  const getSocialMediaConfig = useCallback((campaignKey: string = 'social'): SocialMediaConfig | null => {
    if (!isSocialMediaMission(campaignKey)) {
      return null;
    }

    const platform = getPlatformFromCampaignKey(campaignKey);
    const config = getConfigFromConfig(platform);

    if (!config) {
      return null;
    }

    return {
      platform: platform,
      url: config.url,
      accountName: config.accountName,
      icon: config.icon,
    };
  }, [isSocialMediaMission]);

  const handleSocialMediaMission = useCallback(async (campaignId: number, campaignKey: string, campaign: any) => {
    const config = getSocialMediaConfig(campaignKey);
    if (!config) {
      return false;
    }

    try {
      // Check if we've already handled this campaign to prevent multiple executions
      const storageKey = `social-mission-${campaignId}`;
      if (sessionStorage.getItem(storageKey)) {
        return true;
      }

      // Mark this campaign as being handled
      sessionStorage.setItem(storageKey, 'true');

      // Open social media page in new window/tab
      const newWindow = window.open(
        config.url,
        "_blank",
        "noopener,noreferrer"
      );

      // Opt-in to the campaign regardless of whether the window opened
      // This assumes the user will follow the account
      await optInMutation.mutateAsync({ campaignId, campaign });

      // Update balances with campaign rewards
      updateBalancesFromRewards(campaign.rewards);

      return true;
    } catch (error) {
      console.error('Failed to handle social media mission:', error);
      // Remove the flag on error so it can be retried
      const storageKey = `social-mission-${campaignId}`;
      sessionStorage.removeItem(storageKey);
    }

    return false;
  }, [getSocialMediaConfig, optInMutation, updateBalance, balances, updateBalancesFromRewards]);

  return {
    isSocialMediaMission,
    getSocialMediaConfig,
    handleSocialMediaMission,
  };
}

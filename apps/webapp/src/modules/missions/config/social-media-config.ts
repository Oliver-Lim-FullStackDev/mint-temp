// Configuration for social media missions
// This file allows easy management of which campaigns should use the social media workflow

export enum SocialNetwork {
  X = 'x',
  INSTAGRAM = 'instagram',
  TIKTOK = 'tiktok',
}

export interface SocialPlatformConfig {
  url: string;
  accountName: string;
  icon: string;
}

export interface SocialMediaMissionConfig {
  // Campaign patterns that should trigger social media flow
  campaignPatterns: string[];

  // Social media platform configurations
  platforms: Record<SocialNetwork, SocialPlatformConfig>;

  // Feature flags
  features: {
    // Enable/disable the entire social media workflow
    enabled: boolean;

    // Whether to automatically opt-in when opening social media page
    autoOptIn: boolean;

    // Whether to show the redirect page or directly open social media
    useRedirectPage: boolean;

    // Delay before redirecting back (in milliseconds)
    redirectDelay: number;
  };
}

export const SOCIAL_MEDIA_CONFIG: SocialMediaMissionConfig = {
  campaignPatterns: [
    'follow-mintdotio-social-',
  ],

  platforms: {
    [SocialNetwork.X]: {
      url: 'https://x.com/MintDotIO',
      accountName: '@MintDotIO',
      icon: 'socials:twitter',
    },
    [SocialNetwork.INSTAGRAM]: {
      url: 'https://www.instagram.com/mintdotio/',
      accountName: '@mintdotio',
      icon: 'socials:instagram',
    },
    [SocialNetwork.TIKTOK]: {
      url: 'https://www.tiktok.com/@mintdotio',
      accountName: '@mintdotio',
      icon: 'socials:tiktok',
    },
  },

  features: {
    enabled: true,
    autoOptIn: true,
    useRedirectPage: true,
    redirectDelay: 2000,
  },
};

// Helper function to check if a campaign should use social media workflow
export function shouldUseSocialMediaWorkflow(campaignKey: string): boolean {
  if (!SOCIAL_MEDIA_CONFIG.features.enabled) {
    return false;
  }

  const key = campaignKey.toLowerCase();
  return SOCIAL_MEDIA_CONFIG.campaignPatterns.some(pattern =>
    key.includes(pattern.toLowerCase())
  );
}

// Helper function to get platform from campaign key
export function getPlatformFromCampaignKey(campaignKey: string): SocialNetwork {
  const key = campaignKey.toLowerCase();

  // Check for new format: "follow-mintdotio-social-<platform>"
  if (key.includes('follow-mintdotio-social-')) {
    const platform = key.split('follow-mintdotio-social-')[1];
    if (platform === SocialNetwork.X) return SocialNetwork.X;
    if (platform === SocialNetwork.INSTAGRAM) return SocialNetwork.INSTAGRAM;
    if (platform === SocialNetwork.TIKTOK) return SocialNetwork.TIKTOK;
  }

  // Legacy format: default to X for backward compatibility
  return SocialNetwork.X;
}

// Helper function to get social media config for a platform
export function getSocialMediaConfig(platform: SocialNetwork) {
  return SOCIAL_MEDIA_CONFIG.platforms[platform];
}
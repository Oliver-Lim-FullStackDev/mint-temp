'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Box, Button, CircularProgress } from '@mint/ui/components/core';
import { GlassCard } from '@mint/ui/components';
import { Iconify } from '@mint/ui/components/iconify';

import { InfoDialog, Text } from '@mint/ui/components';
import Loader from '@mint/ui/components/loading-screen/loader';
import { useInfoDialog } from '@mint/ui/hooks';
import { useUpdateBalance, useBalances, useUpdateBalancesFromRewards } from '@/modules/account/session-store';
import TabSelector, { TabOption } from '@/components/core/tab-selector';
import { PageHeader } from '@/components/headers/page-header';
import { useSocialMediaMission } from './hooks/useSocialMediaMission';
import { useMissions, useOptInCampaign, type Campaign, type CampaignReward } from './hooks/useMissions';
import { getPlatformFromCampaignKey, getSocialMediaConfig } from './config/social-media-config';

// Utility function to filter out specific campaigns
const filterExcludedCampaigns = (campaigns: Campaign[]): Campaign[] => {
  // Add keys of campaigns that shouldn't appear in the list
  const excludedKeys = [
    'daily-reward-campaign',
    'daily-reward-campaign-registration',
    'mint-leaderboard',
    'share-and-earn',
  ];
  return campaigns.filter(campaign => !excludedKeys.includes(campaign.key));
};

type EarnProps = {
  initialCampaigns?: Campaign[];
};

export function Earn({ initialCampaigns }: EarnProps = {}) {
  const { data: campaigns = [], isLoading } = useMissions({ initialData: initialCampaigns });
  const optInMutation = useOptInCampaign();
  const updateBalance = useUpdateBalance();
  const updateBalancesFromRewards = useUpdateBalancesFromRewards();
  const balances = useBalances();
  const router = useRouter();
  const { isSocialMediaMission } = useSocialMediaMission();
  const [socialMediaLoading, setSocialMediaLoading] = useState<number | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>('all');
  const { isOpen, openDialog, closeDialog, title, content } = useInfoDialog();

  // Cleanup session storage flags when component unmounts
  useEffect(() => {
    return () => {
      // Clear all social media redirect flags
      campaigns.forEach(campaign => {
        if (isSocialMediaMission(campaign.key)) {
          const redirectKey = `social-redirect-${campaign.id}`;
          sessionStorage.removeItem(redirectKey);
        }
      });
    };
  }, [campaigns, isSocialMediaMission]);

  // Filter out excluded campaigns
  const filteredCampaignsData = filterExcludedCampaigns(campaigns);

  // The field to group campaigns by
  const GROUP_BY_FIELD: keyof Campaign = 'type';
  // Extractor function to get unique values from campaigns based on GROUP_BY_FIELD
  const extractTabOptionsFromCampaigns = (campaigns: Campaign[]): TabOption[] => {
    const uniqueValues = new Set<string>();

    campaigns.forEach(campaign => {
      const fieldValue = campaign[GROUP_BY_FIELD];
      if (fieldValue) {
        const displayValue = typeof fieldValue === 'string'
          ? fieldValue.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
          : String(fieldValue);
        uniqueValues.add(displayValue);
      }
    });

    const options: TabOption[] = [
      { id: 'all', label: 'All', value: 'all' }
    ];

    Array.from(uniqueValues).forEach((value, index) => {
      options.push({
        id: `${index + 1}`,
        label: value,
        value: value.toLowerCase().replace(/\s+/g, '-')
      });
    });

    return options;
  };

  const tabOptions = extractTabOptionsFromCampaigns(filteredCampaignsData);

  // Filter campaigns based on selected tab using GROUP_BY_FIELD
  const filteredCampaigns = selectedTab === 'all'
    ? filteredCampaignsData
    : filteredCampaignsData.filter(campaign => {
        const fieldValue = campaign[GROUP_BY_FIELD];
        if (fieldValue) {
          const displayValue = typeof fieldValue === 'string'
            ? fieldValue.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
            : String(fieldValue);
          const normalizedValue = displayValue.toLowerCase().replace(/\s+/g, '-');
          return normalizedValue === selectedTab;
        }
        return false;
      });

  // Helper function to get mission display data from campaign
  const handleTabChange = (option: TabOption) => {
    setSelectedTab(option.value);
  };
  // Helper function to format numbers with decimals only when needed
  const formatNumber = (value: number): string => {
    const convertedValue = value / 100;
    return convertedValue % 1 === 0 ? convertedValue.toString() : convertedValue.toFixed(2);
  };

  // Helper function to render campaign rewards
  const renderCampaignRewards = (rewards: CampaignReward[]) => {
    if (!rewards || rewards.length === 0) {
      return null;
    }

    // Define the order: MBX first, then RTP, then XPP
    const currencyOrder = ['MBX', 'RTP', 'XPP'];
    const rewardElements: React.ReactElement[] = [];

    // Sort rewards by the defined currency order
    currencyOrder.forEach((currency) => {
      const reward = rewards.find(r => r.currency === currency);
      if (reward) {
        switch (currency) {
          case 'MBX':
            rewardElements.push(
              <Box key="mbx" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Iconify icon="mint:buck-icon" width={20} />
                <Text variant='caption' sx={{ lineHeight: 1 }}>
                  {formatNumber(reward.amount)}
                </Text>
              </Box>
            );
            break;
          case 'RTP':
            rewardElements.push(
              <Box key="rtp" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Iconify icon="mint:raffle-ticket-icon" width={20} height={20} />
                <Text variant='caption' sx={{ lineHeight: 1 }}>
                  {formatNumber(reward.amount)}
                </Text>
              </Box>
            );
            break;
          case 'XPP':
            rewardElements.push(
              <Box key="xpp" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Image alt='ic-xp' src={"/assets/icons/components/ic-xp.svg"} width={20} height={20} />
                <Text variant='caption' sx={{ lineHeight: 1 }}>
                  {formatNumber(reward.amount)}
                </Text>
              </Box>
            );
            break;
        }
      }
    });

    return rewardElements;
  };

  const getMissionDisplayData = (campaign: Campaign) => {
    const isActive = campaign.activeTo > Date.now();
    const isOptedIn = campaign.optInState === 'in';
    const canOptIn = campaign.optInState === 'out';
    const isSocialMedia = isSocialMediaMission(campaign.key);

    // Campaign is available if it's active AND can be opted into
    const isAvailable = isActive && canOptIn;
    // Campaign is unavailable if it's not active (but not if it's already completed)
    const isUnavailable = !isActive && !isOptedIn;

    return {
      id: campaign.id.toString(),
      title: campaign.key.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), // Convert key to title
      rewards: campaign.rewards || [],
      label: isSocialMedia ? 'Social Media Mission' : (campaign.type === 'standard' ? 'Standard Mission' : 'Special Mission'),
      status: isOptedIn ? 'completed' : (isAvailable ? 'available' : 'completed'),
      actionLabel: isOptedIn
        ? 'Completed'
        : (isAvailable
          ? (isSocialMedia ? 'Follow' : 'Go')
          : 'Unavailable'
        ),
      canOptIn: isAvailable,
      isSocialMedia,
      isUnavailable,
    };
  };

  const handleCampaignClick = async (campaign: Campaign) => {
    const mission = getMissionDisplayData(campaign);

    // Only allow clicking if campaign is available, active, and optInState is 'out'
    if (mission.canOptIn) {
      try {
        // Check if this is a social media mission
        if (isSocialMediaMission(campaign.key)) {
          // Prevent multiple clicks by checking if already loading
          if (socialMediaLoading === campaign.id) {
            return;
          }

          // Also check session storage to prevent multiple redirects
          const redirectKey = `social-redirect-${campaign.id}`;
          if (sessionStorage.getItem(redirectKey)) {
            return;
          }

          // Set loading state for social media mission
          setSocialMediaLoading(campaign.id);

          // Mark as redirected to prevent multiple redirects
          sessionStorage.setItem(redirectKey, 'true');

          // Use the social media redirect page for better UX
          const platform = getPlatformFromCampaignKey(campaign.key);
          const campaignData = encodeURIComponent(JSON.stringify(campaign));
          router.push(`/social-redirect?campaignId=${campaign.id}&campaignKey=${campaign.key}&platform=${platform}&returnUrl=/earn&campaignData=${campaignData}`);
        } else {
          // Regular campaign opt-in with campaign data
          await optInMutation.mutateAsync({ campaignId: campaign.id, campaign });

          // Update balances with campaign rewards
          updateBalancesFromRewards(campaign.rewards);
        }
      } catch (error) {
        console.error('Failed to opt into campaign:', error);
        setSocialMediaLoading(null);
      }
    }
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      p: 2,
      height: '100%'
    }}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1.25
      }}>
        <PageHeader
          title="Earn"
          description="Grind today. Flex tomorrow."
          withBg
          showInfoIcon
          onInfoClick={() => {
            openDialog(
              "Earn",
              "Complete tasks to score extra rewards. Social tasks are one-time boosts, Daily Play tasks refresh every 24h, and Store Tasks unlock when you connect or buy. Knock them out, stack up MintBucks (MBX), XP, and Raffle Tickets."
            );
          }}
        />
        <TabSelector
          options={tabOptions}
          selectedValue={selectedTab}
          onSelectionChange={handleTabChange}
        />

        <Text variant="h5" sx={{ mb: 1, color: 'white', fontWeight: '900 !important' }}>
          Complete Mission & Earn
        </Text>
      </Box>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        width: '100%',
        paddingRight: '8px'
      }}>
        {isLoading ? (
          <Loader />
        ) : (
          filteredCampaigns.map((campaign) => {
            const mission = getMissionDisplayData(campaign);
            const isOptInLoading = optInMutation.isPending &&
              optInMutation.variables?.campaignId === campaign.id;

            return (
              <GlassCard
                key={mission.id}
                sx={{
                  display: 'flex',
                  width: '100%',
                  padding: 2,
                  alignItems: 'center',
                  gap: 2,
                  flexDirection: 'row',
                  flexShrink: 0,
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {mission.isSocialMedia && (() => {
                      const platform = getPlatformFromCampaignKey(campaign.key);
                      const config = getSocialMediaConfig(platform);
                      return (
                        <Iconify
                          icon={config?.icon || "socials:twitter"}
                          width={16}
                          height={16}
                        />
                      );
                    })()}
                    <Text variant='subtitle2'>
                      {mission.title}
                    </Text>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {renderCampaignRewards(mission.rewards)}
                  </Box>
                </Box>
                <Button
                  disabled={!mission.canOptIn || isOptInLoading || socialMediaLoading === campaign.id}
                  onClick={() => handleCampaignClick(campaign)}
                  sx={{
                    display: 'flex',
                    height: 30,
                    padding: '0px 8px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 1,
                    borderRadius: 1,
                    background: mission.status === 'claimable'
                      ? 'var(--secondary-main)'
                      : mission.status === 'completed' || mission.isUnavailable
                        ? 'var(--action-disabled-background)'
                        : 'var(--p-main)',
                    color: mission.status === 'completed' || mission.isUnavailable ? 'var(--action-disabled)' : '#000',
                    fontWeight: 700,
                    cursor: mission.canOptIn ? 'pointer' : 'not-allowed',
                    '&:hover': {
                      background: mission.canOptIn
                        ? (mission.status === 'claimable' ? 'var(--secondary-main)' : 'var(--p-main)')
                        : 'var(--action-disabled-background)',
                    },
                  }}
                >
                  {isOptInLoading || socialMediaLoading === campaign.id ? (
                    <CircularProgress
                      size={12}
                      sx={{
                        color: mission.status === 'completed' || mission.isUnavailable
                          ? 'var(--action-disabled)'
                          : '#000'
                      }}
                    />
                  ) : (
                    mission.actionLabel
                  )}
                </Button>
              </GlassCard>
            );
          })
        )}
      </Box>

      <InfoDialog
        open={isOpen}
        onClose={closeDialog}
        title={title}
        content={content}
      />
    </Box>
  );
}

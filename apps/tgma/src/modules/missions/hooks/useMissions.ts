import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mintApi, getServerSession } from '@mint/client';
import { useSetSession } from 'src/modules/account/session-store';

export interface CampaignReward {
  amount: number;
  ppCheckpoint: any;
  kind: string;
  depositAmountFilter: any;
  blitz: any;
  betAmountCents: any;
  zeroWagering: any;
  maximumAmountCents: any;
  spinValueType: any;
  spinValueMinMax: any;
  gameTitle: any;
  currency: string;
  rankFilter: any;
}

export interface Campaign {
  assets: any[];
  rewards: CampaignReward[];
  id: number;
  key: string;
  monsterAvatarUrl: any;
  raceBarColor: any;
  type: string;
  playerProgress: any;
  monsterProgress: any;
  playerRank: any;
  topWinners: any;
  winnersCount: any;
  playersCount: any;
  ppMultiplier: number;
  rewardTrigger: string;
  optInState: string;
  activeTo: number;
  playerScore: any;
}

// Legacy interface for backward compatibility
export interface Mission {
  id: string;
  title: string;
  exp: number;
  tickets: number;
  label: string;
  status: 'available' | 'completed' | 'claimable';
  actionLabel: string;
}

async function fetchMissions(): Promise<Campaign[]> {
  const result = await mintApi.get<Campaign[]>('/missions');
  return result || [];
}

async function optInCampaign(campaignId: number): Promise<any> {
  return mintApi.post('/missions/opt-in', { campaign_id: campaignId });
}

export function useMissions(options?: { initialData?: Campaign[] }) {
  return useQuery({
    queryKey: ['missions'],
    queryFn: fetchMissions,
    initialData: options?.initialData,
    placeholderData: options?.initialData,
  });
}

export function useOptInCampaign() {
  const queryClient = useQueryClient();
  const setSession = useSetSession();

  return useMutation({
    mutationFn: ({ campaignId, campaign }: { campaignId: number; campaign: Campaign }) =>
      optInCampaign(campaignId),
    onSuccess: async (data, variables) => {
      // Refetch missions after successful opt-in
      queryClient.invalidateQueries({ queryKey: ['missions'] });

      // Refresh session to sync balances from server
      try {
        const session = await getServerSession();
        if (session) {
          setSession(session);
        }
      } catch (error) {
        console.error('Failed to refresh session after campaign opt-in:', error);
      }

      // Return the campaign data so the component can handle balance updates
      return variables.campaign;
    },
  });
}

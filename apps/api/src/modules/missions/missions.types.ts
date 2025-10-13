export type MissionStatus = 'available' | 'completed' | 'claimable';

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
  status: MissionStatus;
  actionLabel: string;
}

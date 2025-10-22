import { IsNumber } from 'class-validator';

export class OptInCampaignDto {
  @IsNumber()
  campaign_id: number;
}

export class CampaignResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface LeaderBoardData {
  assets: any[];
  rewards: Reward[];
  key: string;
  name: string;
  monsterName: any;
  raceBarColor: any;
  campaignType: string;
  playerProgress: number;
  monsterProgress: any;
  playerRank: any;
  topWinners: [string, number][];
  winnersCount: any;
  playersCount: number;
  rewardTrigger: string;
}

export interface Reward {
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
  rankFilter: RankFilter;
}

export interface RankFilter {
  rank_begin: number;
  rank_end: number;
}

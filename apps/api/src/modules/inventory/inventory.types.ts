export interface InventoryItem {
  id: number;
  active: boolean;
  activeFrom: string;
  amountCents: number;
  createdAt: string;
  currency: string;
  expiresAt: string;
  reason: string;
  redirectUrl: string | null;
  seen: boolean;
  turnoverCentsLeft: number;
  type: string;
  used: boolean;
  usedAt: string | null;
}

export type InventoryResponse = InventoryItem[];

export const DAILY_REWARDS_REASON_KEY = [
  'Giveout for daily-reward-campaign campaign',
  'Giveout for daily-reward-campaign-registration campaign'
];
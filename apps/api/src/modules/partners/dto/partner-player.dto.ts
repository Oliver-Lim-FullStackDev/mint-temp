export interface PartnerPlayerDto {
  id: string;
  username: string;
  createdAt: string;
  balances: {
    MBX: number;
    XP: number;
    RTP: number;
    SPN: number;
  };
}
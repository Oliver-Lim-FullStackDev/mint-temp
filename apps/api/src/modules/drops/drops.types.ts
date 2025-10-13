export type DropActionLabel = 'Go' | 'Claimed' | 'Claim';

export interface DropSectionItem {
  id: string;
  title: string;
  exp: number;
  tickets: number;
  label: string;
  actionLabel: DropActionLabel;
}

export interface DropData {
  qualify: DropSectionItem[];
  boosters: DropSectionItem[];
}

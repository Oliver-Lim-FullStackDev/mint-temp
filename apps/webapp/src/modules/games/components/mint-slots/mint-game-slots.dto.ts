import type {
  GameInitResponse,
  GamePlayResponse,
  SlotGameConfig as StudioSlotGameConfig,
  SlotPlayResult,
  WinningCombination,
  SlotGrid,
} from '@mint/game-internal';

export type SlotGameConfig = StudioSlotGameConfig;
export type SlotGameResultDto = GamePlayResponse<SlotPlayResult>;
export type SlotGameInitDto = GameInitResponse<StudioSlotGameConfig>;

export type { WinningCombination, SlotGrid };

export interface SlotGameRequestDto {
  clientSeed?: string;
  wager: number;
}

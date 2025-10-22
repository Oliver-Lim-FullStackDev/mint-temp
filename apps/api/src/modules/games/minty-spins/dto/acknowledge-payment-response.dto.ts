export class AcknowledgePaymentResponseDto {
  studioId!: string;
  gameId!: string;
  action!: string;
  received!: boolean;
  payload!: Record<string, unknown>;
}

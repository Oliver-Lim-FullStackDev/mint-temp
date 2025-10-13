import { UnauthorizedException } from '@nestjs/common';

export const errorHandler = (err: unknown, errorText?: string) => {
  const errorMessage = err instanceof Error ? err.message : String(err);
  throw new UnauthorizedException(`${errorText} ${errorMessage}`);
};

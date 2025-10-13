import { IsString, IsNotEmpty } from 'class-validator';

/**
 * DTO for token validation request
 */
export class ValidateTokenDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}

/**
 * DTO for token response
 */
export class TokenResponseDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}

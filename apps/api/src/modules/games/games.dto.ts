import { IsArray, IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GameSearchDto {
  @IsOptional()
  @IsArray()
  @Type(() => String)
  tags?: string[];

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}

import { IsString, IsOptional, IsBoolean, IsObject } from 'class-validator';

export class CreateStoreItemDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsObject()
  price: Record<string, number>;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}

export class UpdateStoreItemDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsObject()
  price?: Record<string, number>;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsBoolean()
  available?: boolean;
}

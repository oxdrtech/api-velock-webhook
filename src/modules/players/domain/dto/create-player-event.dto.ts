import { IsString, IsEmail, ValidateNested, IsDate, IsOptional, IsInt } from 'class-validator';
import { Transform, Type } from 'class-transformer';

class PlayerDataDto {
  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  tenantId?: string | null;

  @IsOptional()
  @IsString()
  affiliateId?: string | null;

  @IsOptional()
  @IsString()
  name?: string | null;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  country?: string | null;

  @IsOptional()
  @IsString()
  language?: string | null;

  @IsOptional()
  @Transform(({ value }) => value ? new Date(value) : null)
  @IsDate()
  date: Date | null;

  @IsOptional()
  @IsString()
  phoneCountryCode?: string | null;

  @IsOptional()
  @IsString()
  phone?: string | null;

  @IsOptional()
  @IsInt()
  balance?: number;

  @IsOptional()
  @Transform(({ value }) => value ? new Date(value) : null)
  @IsDate()
  birthDate?: Date | null;
}

export class CreatePlayerEventDto {
  @IsString()
  name: string;

  @IsString()
  event: string;

  @ValidateNested()
  @Type(() => PlayerDataDto)
  data: PlayerDataDto;
}

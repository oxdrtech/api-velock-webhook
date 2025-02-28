import { IsString, IsEmail, IsInt, IsOptional, IsEnum, IsDate } from 'class-validator';
import { PlayerStatus } from '@prisma/client';
import { Transform } from 'class-transformer';

export class CreatePlayerDto {
  @IsString()
  externalId: string;

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
  date?: Date | null;

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

  @IsOptional()
  @Transform(({ value }) => value ? new Date(value) : null)
  @IsDate()
  firstDepositDate?: Date | null;

  @IsOptional()
  @IsInt()
  firstDepositValue?: number | null;

  @IsOptional()
  @Transform(({ value }) => value ? new Date(value) : null)
  @IsDate()
  lastDepositDate?: Date | null;

  @IsOptional()
  @IsInt()
  lastDepositValue?: number | null;

  @IsOptional()
  @IsInt()
  totalDepositCount?: number | null;

  @IsOptional()
  @IsInt()
  totalDepositValue?: number | null;

  @IsOptional()
  @Transform(({ value }) => value ? new Date(value) : null)
  @IsDate()
  lastWithdrawalDate?: Date | null;

  @IsOptional()
  @IsInt()
  lastWithdrawalValue?: number | null;

  @IsOptional()
  @IsInt()
  totalWithdrawalCount?: number | null;

  @IsOptional()
  @IsInt()
  totalWithdrawalValue?: number | null;

  @IsOptional()
  @IsString()
  mostFrequentBetPair?: string | null;

  @IsOptional()
  @IsString()
  mostFrequentViewedPair?: string | null;

  @IsOptional()
  @Transform(({ value }) => value ? new Date(value) : null)
  @IsDate()
  lastLoginDate?: Date | null;

  @IsOptional()
  @Transform(({ value }) => value ? new Date(value) : null)
  @IsDate()
  lastAccessDate?: Date | null;

  @IsOptional()
  @IsEnum(PlayerStatus)
  playerStatus?: PlayerStatus;
}

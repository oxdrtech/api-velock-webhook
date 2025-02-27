import { IsString, IsEmail, IsInt, IsOptional, IsEnum, IsDate } from 'class-validator';
import { PlayerStatus } from '@prisma/client';
import { Transform } from 'class-transformer';

export class CreatePlayerDto {
  @IsString()
  externalId: string;

  @IsString()
  tenantId: string;

  @IsString()
  affiliateId: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  country: string;

  @IsString()
  language: string;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  date: Date;

  @IsString()
  phoneCountryCode: string;

  @IsString()
  phone: string;

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
  firstDepositValue?: number;

  @IsOptional()
  @Transform(({ value }) => value ? new Date(value) : null)
  @IsDate()
  lastDepositDate?: Date | null;

  @IsOptional()
  @IsInt()
  lastDepositValue?: number;

  @IsOptional()
  @IsInt()
  totalDepositCount?: number;

  @IsOptional()
  @IsInt()
  totalDepositValue?: number;

  @IsOptional()
  @Transform(({ value }) => value ? new Date(value) : null)
  @IsDate()
  lastWithdrawalDate?: Date | null;

  @IsOptional()
  @IsInt()
  lastWithdrawalValue?: number;

  @IsOptional()
  @IsInt()
  totalWithdrawalCount?: number;

  @IsOptional()
  @IsInt()
  totalWithdrawalValue?: number;

  @IsOptional()
  @IsString()
  mostFrequentBetPair?: string;

  @IsOptional()
  @IsString()
  mostFrequentViewedPair?: string;

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

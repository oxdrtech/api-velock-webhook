import { Status } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsBoolean, IsDate, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateDepositDto {
  @IsString()
  transactionId: string;

  @IsInt()
  amount: number;

  @IsOptional()
  @IsString()
  method?: string | null;

  @IsOptional()
  @Transform(({ value }) => value ? new Date(value) : null)
  @IsDate()
  date?: Date | null;

  @IsOptional()
  @IsString()
  currency?: string | null;

  @IsOptional()
  @IsBoolean()
  isFirstTime?: boolean;

  @IsOptional()
  @IsEnum(Status)
  depositStatus?: Status;

  @IsString()
  playerId: string;
}

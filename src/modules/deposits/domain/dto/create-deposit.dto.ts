import { Status } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsBoolean, IsDate, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateDepositDto {
  @IsString()
  transactionId: string;

  @IsInt()
  amount: number;

  @IsString()
  method: string;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  date: Date;

  @IsString()
  currency: string;

  @IsOptional()
  @IsBoolean()
  isFirstTime?: boolean;

  @IsOptional()
  @IsEnum(Status)
  depositStatus?: Status;

  @IsString()
  playerId: string;
}

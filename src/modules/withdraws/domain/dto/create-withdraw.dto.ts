import { Transform } from "class-transformer";
import { IsDate, IsInt, IsOptional, IsString } from "class-validator";

export class CreateWithdrawDto {
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

  @IsString()
  playerId: string;
}

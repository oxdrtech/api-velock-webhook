import { Transform } from "class-transformer";
import { IsDate, IsInt, IsString } from "class-validator";

export class CreateWithdrawDto {
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

  @IsString()
  playerId: string;
}

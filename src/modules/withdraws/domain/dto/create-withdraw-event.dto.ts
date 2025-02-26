import { Transform, Type } from "class-transformer";
import { IsDate, IsEmail, IsInt, IsString, ValidateNested } from "class-validator";

class WithdrawDataDto {
  @IsString()
  id: string;

  @IsString()
  userId: string;

  @IsString()
  tenantId: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsInt()
  amount: number;

  @IsString()
  method: string;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  date: Date;

  @IsString()
  currency: string;
}

export class CreateWithdrawEventDto {
  @IsString()
  name: string;

  @IsString()
  event: string;

  @ValidateNested()
  @Type(() => WithdrawDataDto)
  data: WithdrawDataDto;
}

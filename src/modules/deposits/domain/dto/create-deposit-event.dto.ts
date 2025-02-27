import { Transform, Type } from "class-transformer";
import { IsDate, IsEmail, IsInt, IsString, ValidateNested } from "class-validator";

class DepositDataDto {
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

  @IsString()
  phoneCountryCode: string;

  @IsString()
  phone: string;
}

export class CreateDepositEventDto {
  @IsString()
  name: string;

  @IsString()
  event: string;

  @ValidateNested()
  @Type(() => DepositDataDto)
  data: DepositDataDto;
}

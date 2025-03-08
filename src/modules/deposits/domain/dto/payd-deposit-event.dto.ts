import { Transform, Type } from "class-transformer";
import { IsBoolean, IsDate, IsEmail, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

class DepositDataDto {
  @IsString()
  id: string;

  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  tenantId?: string | null;

  @IsOptional()
  @IsString()
  name?: string | null;

  @IsOptional()
  @IsEmail()
  email?: string | null;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  method?: string | null;

  @IsOptional()
  @IsBoolean()
  isFirstTime?: boolean;

  @IsOptional()
  @Transform(({ value }) => value ? new Date(value) : null)
  @IsDate()
  date?: Date | null;

  @IsOptional()
  @IsString()
  currency?: string | null;

  @IsOptional()
  @IsString()
  phoneCountryCode?: string | null;

  @IsOptional()
  @IsString()
  phone: string | null;
}

export class PaydDepositEventDto {
  @IsString()
  name: string;

  @IsString()
  event: string;

  @ValidateNested()
  @Type(() => DepositDataDto)
  data: DepositDataDto;
}

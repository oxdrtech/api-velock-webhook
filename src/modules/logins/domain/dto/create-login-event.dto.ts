import { Transform, Type } from "class-transformer";
import { IsDate, IsEmail, IsOptional, IsString, ValidateNested } from "class-validator";

class LoginDataDto {
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

  @IsOptional()
  @IsEmail()
  email?: string | null;

  @IsString()
  ipAddress: string;

  @IsOptional()
  @Transform(({ value }) => value ? new Date(value) : null)
  @IsDate()
  date?: Date | null;

  @IsOptional()
  @IsString()
  phoneCountryCode?: string | null;

  @IsOptional()
  @IsString()
  phone: string | null;
}

export class CreateLoginEventDto {
  @IsString()
  name: string;

  @IsString()
  event: string;

  @ValidateNested()
  @Type(() => LoginDataDto)
  data: LoginDataDto;
}

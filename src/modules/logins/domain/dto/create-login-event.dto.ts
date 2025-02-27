import { Transform, Type } from "class-transformer";
import { IsDate, IsEmail, IsString, ValidateNested } from "class-validator";

class LoginDataDto {
  @IsString()
  userId: string;

  @IsString()
  tenantId: string;

  @IsString()
  affiliateId: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  ipAddress: string;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  date: Date;

  @IsString()
  phoneCountryCode: string;

  @IsString()
  phone: string;
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

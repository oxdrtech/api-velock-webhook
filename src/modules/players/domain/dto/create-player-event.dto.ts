import { IsString, IsEmail, ValidateNested, IsDate, IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer';

class PlayerDataDto {
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
  country: string;

  @IsString()
  language: string;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  date: Date;

  @IsOptional()
  @IsString()
  phoneNumber?: string;
  
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  birthDate?: Date;
}

export class CreatePlayerEventDto {
  @IsString()
  name: string;

  @IsString()
  event: string;

  @ValidateNested()
  @Type(() => PlayerDataDto)
  data: PlayerDataDto;
}

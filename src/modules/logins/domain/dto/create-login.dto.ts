import { Transform } from "class-transformer";
import { IsDate, IsOptional, IsString } from "class-validator";

export class CreateLoginDto {
  @IsString()
  ipAddress: string;

  @IsOptional()
  @Transform(({ value }) => value ? new Date(value) : null)
  @IsDate()
  date?: Date | null;

  @IsString()
  playerId: string;
}

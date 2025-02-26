import { Transform } from "class-transformer";
import { IsDate, IsString } from "class-validator";

export class CreateLoginDto {
  @IsString()
  ipAddress: string;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  date: Date;

  @IsString()
  playerId: string;
}

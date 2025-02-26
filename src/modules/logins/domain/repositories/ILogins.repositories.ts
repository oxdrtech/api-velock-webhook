import { Login } from "@prisma/client";
import { CreateLoginDto } from "../dto/create-login.dto";

export interface ILoginsRepositories {
  createLogin(data: CreateLoginDto): Promise<Login>;
  findLoginById(id: string): Promise<Login>;
  findLoginsByPlayerId(playerId: string): Promise<Login[]>;
}

import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ILoginsRepositories } from "../domain/repositories/ILogins.repositories";
import { IPlayersRepositories } from "src/modules/players/domain/repositories/IPlayers.repositories";
import { Login } from "@prisma/client";
import { LOGINS_SERVICE_TOKEN } from "../utils/loginsServiceToken";
import { PLAYERS_SERVICE_TOKEN } from "src/modules/players/utils/playersServiceToken";

@Injectable()
export class FindLoginsByPlayerIdService {
  constructor(
    @Inject(LOGINS_SERVICE_TOKEN)
    private readonly loginsRepositories: ILoginsRepositories,
    @Inject(PLAYERS_SERVICE_TOKEN)
    private readonly playersRepositories: IPlayersRepositories,
  ) { }

  async execute(playerId: string): Promise<Login[]> {
    const [playerIdExists, loginsByPlayerIdExists] = await Promise.all([
      this.playersRepositories.findPlayerById(playerId),
      this.loginsRepositories.findLoginsByPlayerId(playerId),
    ]);

    if (!playerIdExists) throw new NotFoundException('Player não existe');
    if (loginsByPlayerIdExists.length === 0) throw new NotFoundException('Esse player ainda não possui nenhum login.');

    return loginsByPlayerIdExists;
  }
}

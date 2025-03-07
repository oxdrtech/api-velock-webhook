import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ILoginsRepositories } from "../domain/repositories/ILogins.repositories";
import { Login } from "@prisma/client";
import { IPlayersRepositories } from "src/modules/players/domain/repositories/IPlayers.repositories";
import { UpdatePlayerDto } from "src/modules/players/domain/dto/update-player.dto";
import { CreateLoginEventDto } from "../domain/dto/create-login-event.dto";
import { CreateLoginDto } from "../domain/dto/create-login.dto";
import { LoginsListener } from "src/modules/socket/infra/listeners/logins.listener";
import { LOGINS_SERVICE_TOKEN } from "../utils/loginsServiceToken";
import { PLAYERS_SERVICE_TOKEN } from "src/modules/players/utils/playersServiceToken";

@Injectable()
export class CreateLoginService {
  constructor(
    @Inject(LOGINS_SERVICE_TOKEN)
    private readonly loginsRepositories: ILoginsRepositories,
    @Inject(PLAYERS_SERVICE_TOKEN)
    private readonly playersRepositories: IPlayersRepositories,
    private readonly loginsListener: LoginsListener,
  ) { }

  async execute(data: CreateLoginEventDto): Promise<Login> {
    const { data: loginData } = data;

    const playerExternalIdExisting = await this.playersRepositories.findPlayerByExternalId(loginData.userId);

    if (!playerExternalIdExisting) throw new NotFoundException('Player não existe');

    const updatePlayerData: UpdatePlayerDto = {
      lastLoginDate: new Date,
    };

    await this.playersRepositories.updatePlayer(playerExternalIdExisting.id, updatePlayerData);

    const updateLoginData: CreateLoginDto = {
      ipAddress: loginData.ipAddress,
      date: loginData.date,
      playerId: playerExternalIdExisting.id,
    };

    const createdLogin = await this.loginsRepositories.createLogin(updateLoginData);

    const updatedPlayer = await this.playersRepositories.findPlayerByExternalId(loginData.userId);
    this.loginsListener.emitLoginCreated(createdLogin, updatedPlayer);

    return createdLogin;
  }
}

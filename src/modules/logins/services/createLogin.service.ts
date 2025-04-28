import { Inject, Injectable } from "@nestjs/common";
import { ILoginsRepositories } from "../domain/repositories/ILogins.repositories";
import { Login, LogStatus, LogType } from "@prisma/client";
import { IPlayersRepositories } from "src/modules/players/domain/repositories/IPlayers.repositories";
import { UpdatePlayerDto } from "src/modules/players/domain/dto/update-player.dto";
import { CreateLoginEventDto } from "../domain/dto/create-login-event.dto";
import { CreateLoginDto } from "../domain/dto/create-login.dto";
import { LoginsListener } from "src/modules/socket/infra/listeners/logins.listener";
import { LOGINS_SERVICE_TOKEN } from "../utils/loginsServiceToken";
import { PLAYERS_SERVICE_TOKEN } from "src/modules/players/utils/playersServiceToken";
import { CreateLogService } from "src/modules/logs/services/createLog.service";

@Injectable()
export class CreateLoginService {
  constructor(
    @Inject(LOGINS_SERVICE_TOKEN)
    private readonly loginsRepositories: ILoginsRepositories,
    @Inject(PLAYERS_SERVICE_TOKEN)
    private readonly playersRepositories: IPlayersRepositories,
    private readonly loginsListener: LoginsListener,
    private readonly createLogService: CreateLogService,
  ) { }

  async execute(data: CreateLoginEventDto): Promise<Login> {
    try {
      const { data: loginData } = data;
      const playerExternalIdExisting = await this.playersRepositories.findPlayerByExternalId(loginData.userId);

      let player = playerExternalIdExisting;
      if (!player) {
        player = await this.playersRepositories.createPlayer({
          externalId: loginData.userId,
          tenantId: loginData.tenantId,
          name: loginData.name,
          email: loginData.email || "",
          phone: loginData.phone,
        })
      };

      const updatePlayerData: UpdatePlayerDto = {
        lastLoginDate: new Date(),
      };

      await this.playersRepositories.updatePlayer(player.id, updatePlayerData);

      const updateLoginData: CreateLoginDto = {
        ipAddress: loginData.ipAddress,
        date: loginData.date,
        playerId: player.id,
      };

      const createdLogin = await this.loginsRepositories.createLogin(updateLoginData);
      const updatedPlayer = await this.playersRepositories.findPlayerByExternalId(loginData.userId);

      this.loginsListener.emitLoginCreated(createdLogin, updatedPlayer);

      // await this.createLogService.execute({
      //   logStatus: LogStatus.SUCCESS,
      //   logType: LogType.LOGIN,
      //   message: 'Login criado com sucesso',
      //   payload: createdLogin,
      //   entityId: createdLogin.id,
      // });

      return createdLogin;
    } catch (error) {
      await this.createLogService.execute({
        logStatus: LogStatus.FAILED,
        logType: LogType.LOGIN,
        message: error.message,
        payload: { input: data },
      });
    }
  }
}

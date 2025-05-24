import { PlayersRepository } from "src/modules/players/infra/players.repository";
import { IAnalyticsRepositories } from "../domain/repositories/IAnalyticsRepositories";
import { DepositsRepository } from "src/modules/deposits/infra/deposits.repository";
import { Inject, Injectable } from "@nestjs/common";
import { PLAYERS_SERVICE_TOKEN } from "src/modules/players/utils/playersServiceToken";
import { DEPOSITS_SERVICE_TOKEN } from "src/modules/deposits/utils/depositsServiceToken";
import { CreatePlayerDto } from "src/modules/players/domain/dto/create-player.dto";
import { CreateDepositDto } from "src/modules/deposits/domain/dto/create-deposit.dto";

@Injectable()
export class AnalyticsRepository implements IAnalyticsRepositories {
  constructor(
    @Inject(PLAYERS_SERVICE_TOKEN)
    private readonly playersRepository: PlayersRepository,
    @Inject(DEPOSITS_SERVICE_TOKEN)
    private readonly depositsRepository: DepositsRepository,
  ) { }

  async upsertPlayer(player: CreatePlayerDto): Promise<void> {
    const existingPlayer = await this.playersRepository.findPlayerByExternalId(player.externalId);
    existingPlayer
      ? await this.playersRepository.updatePlayer(existingPlayer.id, player)
      : await this.playersRepository.createPlayer(player);
  }

  async upsertDeposit(deposit: CreateDepositDto): Promise<void> {
    const existingDeposit = await this.depositsRepository.findDepositByTransactionId(deposit.transactionId);
    existingDeposit
      ? await this.depositsRepository.paydDeposit(existingDeposit.id, deposit).catch((err) => console.log("err paydDeposit", err))
      : await this.depositsRepository.createDeposit({
        ...deposit,
        isFirstTime: true,
      });
  }
}

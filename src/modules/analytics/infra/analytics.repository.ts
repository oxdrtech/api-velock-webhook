import { PlayersRepository } from "src/modules/players/infra/players.repository";
import { IAnalyticsRepositories } from "../domain/repositories/IAnalyticsRepositories";
import { DepositsRepository } from "src/modules/deposits/infra/deposits.repository";
import { Deposit, Player } from "@prisma/client";
import { Inject, Injectable } from "@nestjs/common";
import { PLAYERS_SERVICE_TOKEN } from "src/modules/players/utils/playersServiceToken";
import { DEPOSITS_SERVICE_TOKEN } from "src/modules/deposits/utils/depositsServiceToken";

@Injectable()
export class AnalyticsRepository implements IAnalyticsRepositories {
  constructor(
    @Inject(PLAYERS_SERVICE_TOKEN)
    private readonly playersRepository: PlayersRepository,
    @Inject(DEPOSITS_SERVICE_TOKEN)
    private readonly depositsRepository: DepositsRepository,
  ) { }

  async upsertPlayer(player: Player): Promise<void> {
    const existingPlayer = await this.playersRepository.findPlayerByExternalId(player.externalId);
    existingPlayer
      ? await this.playersRepository.updatePlayer(existingPlayer.id, player)
      : await this.playersRepository.createPlayer(player);
  }

  async upsertDeposit(deposit: Deposit): Promise<void> {
    const existingDeposit = await this.depositsRepository.findDepositByTransactionId(deposit.transactionId);
    existingDeposit
      ? await this.depositsRepository.paydDeposit(existingDeposit.id, deposit)
      : await this.depositsRepository.createDeposit(deposit);
  }
}

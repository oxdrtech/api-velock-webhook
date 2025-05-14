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
    try {
      const existingPlayer = await this.playersRepository.findPlayerByExternalId(player.externalId);
      existingPlayer
        ? await this.playersRepository.updatePlayer(existingPlayer.id, player)
        : await this.playersRepository.createPlayer(player);
    } catch (error) {
      throw new Error(`Failed to upsert player ${player.externalId}: ${error.message}`);
    }
  }

  async upsertDeposit(deposit: CreateDepositDto): Promise<void> {
    try {
      const player = await this.playersRepository.findPlayerById(deposit.playerId);
      if (!player) {
        throw new Error(`Jogador com ID ${deposit.playerId} não encontrado`);
      }
      const existingDeposit = await this.depositsRepository.findDepositByTransactionId(deposit.transactionId);
      existingDeposit
        ? await this.depositsRepository.paydDeposit(existingDeposit.id, deposit).catch((err) => console.log("err paydDeposit", err))
        : await this.depositsRepository.createDeposit(deposit).catch((err) => console.log("err createDeposit", err));
    } catch (error) {
      throw new Error(`Failed to upsert deposit ${deposit.transactionId}: ${error.message}`);
    }
  }
}

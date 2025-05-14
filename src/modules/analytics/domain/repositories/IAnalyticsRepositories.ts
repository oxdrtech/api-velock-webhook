import { CreateDepositDto } from "src/modules/deposits/domain/dto/create-deposit.dto";
import { CreatePlayerDto } from "src/modules/players/domain/dto/create-player.dto";

export interface IAnalyticsRepositories {
  upsertPlayer(Player: CreatePlayerDto): Promise<void>;
  upsertDeposit(deposit: CreateDepositDto): Promise<void>;
}

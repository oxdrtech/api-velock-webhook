import { Deposit, Player } from "@prisma/client";

export interface IAnalyticsRepositories {
  upsertPlayer(Player: Player): Promise<void>;
  upsertDeposit(deposit: Deposit): Promise<void>;
}

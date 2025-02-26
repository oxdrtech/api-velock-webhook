import { Withdraw } from "@prisma/client";
import { CreateWithdrawDto } from "../dto/create-withdraw.dto";

export interface IWithdrawsRepositories {
  createWithdraw(data: CreateWithdrawDto): Promise<Withdraw>;
  findWithdrawById(id: string): Promise<Withdraw>;
  findWithdrawByTransactionId(transactionId: string): Promise<Withdraw>;
  findWithdrawsByPlayerId(playerId: string): Promise<Withdraw[]>;
}

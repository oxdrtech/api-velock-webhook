import { Deposit } from '@prisma/client';
import { CreateDepositDto } from '../dto/create-deposit.dto';
import { UpdateDepositDto } from '../dto/update-deposit.dto';

export interface IDepositsRepositories {
  createDeposit(data: CreateDepositDto): Promise<Deposit>;
  findDepositById(id: string): Promise<Deposit>;
  findDepositByTransactionId(transactionId: string): Promise<Deposit>;
  findDepositsByPlayerId(playerId: string): Promise<Deposit[]>;
  paydDeposit(id: string, data: UpdateDepositDto): Promise<Deposit>;
}

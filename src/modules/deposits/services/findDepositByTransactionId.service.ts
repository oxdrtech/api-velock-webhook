import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DEPOSITS_SERVICE_TOKEN } from '../utils/depositsServiceToken';
import { IDepositsRepositories } from '../domain/repositories/IDeposits.repositories';
import { Deposit } from '@prisma/client';

@Injectable()
export class FindDepositByTransactionIdService {
  constructor(
    @Inject(DEPOSITS_SERVICE_TOKEN)
    private readonly depositsRepositories: IDepositsRepositories,
  ) { }

  async execute(transactionId: string): Promise<Deposit> {
    const deposit = await this.depositsRepositories.findDepositByTransactionId(transactionId);

    if (!deposit) throw new NotFoundException('Deposito não existe');

    return deposit;
  }
}

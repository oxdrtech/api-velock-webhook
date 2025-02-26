import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DEPOSITS_SERVICE_TOKEN } from '../utils/depositsServiceToken';
import { IDepositsRepositories } from '../domain/repositories/IDeposits.repositories';
import { Deposit } from '@prisma/client';

@Injectable()
export class FindDepositByIdService {
  constructor(
    @Inject(DEPOSITS_SERVICE_TOKEN)
    private readonly depositsRepositories: IDepositsRepositories,
  ) { }

  async execute(id: string): Promise<Deposit> {
    const deposit = await this.depositsRepositories.findDepositById(id);

    if (!deposit) throw new NotFoundException('Deposito não existe');

    return deposit;
  }
}

import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Withdraw } from '@prisma/client';
import { WITHDRAW_SERVICE_TOKEN } from '../utils/withdrawsServiceToken';
import { IWithdrawsRepositories } from '../domain/repositories/IWithdraw.repositories';

@Injectable()
export class FindWithdrawByIdService {
  constructor(
    @Inject(WITHDRAW_SERVICE_TOKEN)
    private readonly withdrawsRepositories: IWithdrawsRepositories,
  ) { }

  async execute(id: string): Promise<Withdraw> {
    const withdraw = await this.withdrawsRepositories.findWithdrawById(id);
    if (!withdraw) throw new NotFoundException('Saque não existe');
    return withdraw;
  }
}

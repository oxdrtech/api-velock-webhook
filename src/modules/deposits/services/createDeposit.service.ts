import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DEPOSITS_SERVICE_TOKEN } from '../utils/depositsServiceToken';
import { IDepositsRepositories } from '../domain/repositories/IDeposits.repositories';
import { CreateDepositDto } from '../domain/dto/create-deposit.dto';
import { Deposit } from '@prisma/client';
import { IPlayersRepositories } from 'src/modules/players/domain/repositories/IPlayers.repositories';
import { CreateDepositEventDto } from '../domain/dto/create-deposit-event.dto';
import { DepositsListener } from 'src/modules/socket/infra/listeners/deposits.listener';
import { PLAYERS_SERVICE_TOKEN } from 'src/modules/players/utils/playersServiceToken';

@Injectable()
export class CreateDepositService {
  constructor(
    @Inject(DEPOSITS_SERVICE_TOKEN)
    private readonly depositsRepositories: IDepositsRepositories,
    @Inject(PLAYERS_SERVICE_TOKEN)
    private readonly playersRepositories: IPlayersRepositories,
    private readonly depositsListener: DepositsListener,
  ) { }

  async execute(data: CreateDepositEventDto): Promise<Deposit> {
    const { data: depositData } = data;

    const [playerExternalIdExisting, depositTransactionIdExists] = await Promise.all([
      this.playersRepositories.findPlayerByExternalId(depositData.userId),
      this.depositsRepositories.findDepositByTransactionId(depositData.id),
    ]);

    if (!playerExternalIdExisting) throw new NotFoundException('Player não existe');
    if (depositTransactionIdExists) throw new BadRequestException('Já existe um deposito com esse ID de transação');

    const depositAmountInCents = Math.round(depositData.amount * 100);

    const updateDepositData: CreateDepositDto = {
      transactionId: depositData.id,
      amount: depositAmountInCents,
      method: depositData.method,
      date: depositData.date,
      currency: depositData.currency,
      playerId: playerExternalIdExisting.id,
    };

    const createdDeposit = await this.depositsRepositories.createDeposit(updateDepositData);
    const updatedPlayer = await this.playersRepositories.findPlayerByExternalId(depositData.userId);

    this.depositsListener.emitDepositCreated(createdDeposit, updatedPlayer);

    return createdDeposit;
  }
}

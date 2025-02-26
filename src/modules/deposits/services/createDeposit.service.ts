import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DEPOSITS_SERVICE_TOKEN } from '../utils/depositsServiceToken';
import { IDepositsRepositories } from '../domain/repositories/IDeposits.repositories';
import { CreateDepositDto } from '../domain/dto/create-deposit.dto';
import { Deposit } from '@prisma/client';
import { IPlayersRepositories } from 'src/modules/players/domain/repositories/IPlayers.repositories';
import { PLAYERS_SERVICE_TOKEN } from 'src/modules/logins/utils/playersServiceToken';
import { CreateDepositEventDto } from '../domain/dto/create-deposit-event.dto';

@Injectable()
export class CreateDepositService {
  constructor(
    @Inject(DEPOSITS_SERVICE_TOKEN)
    private readonly depositsRepositories: IDepositsRepositories,
    @Inject(PLAYERS_SERVICE_TOKEN)
    private readonly playersRepositories: IPlayersRepositories,
  ) { }

  async execute(data: CreateDepositEventDto): Promise<Deposit> {
    const { data: depositData } = data;

    const [playerExternalIdExisting, depositTransactionIdExists] = await Promise.all([
      this.playersRepositories.findPlayerByExternalId(depositData.userId),
      this.depositsRepositories.findDepositByTransactionId(depositData.id),
    ]);

    if (!playerExternalIdExisting) throw new NotFoundException('Player não existe');
    if (depositTransactionIdExists) throw new BadRequestException('Já existe um deposito com esse ID de transação');

    const updateDepositData: CreateDepositDto = {
      transactionId: depositData.id,
      amount: depositData.amount,
      method: depositData.method,
      date: depositData.date,
      currency: depositData.currency,
      playerId: playerExternalIdExisting.id,
    };

    return await this.depositsRepositories.createDeposit(updateDepositData);
  }
}

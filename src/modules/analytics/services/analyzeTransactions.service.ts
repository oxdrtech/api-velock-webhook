import { Inject, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Cron } from '@nestjs/schedule';
import { firstValueFrom } from 'rxjs';
import { IAnalyticsRepositories } from '../domain/repositories/IAnalyticsRepositories';
import { LogStatus, LogType } from '@prisma/client';
import { CreateLogService } from 'src/modules/logs/services/createLog.service';
import { ANALYTICS_SERVICE_TOKEN } from '../utils/analyticsServiceToken';
import { ApiDepositTransactionDto } from '../domain/dto/api-deposit-transaction.dto';
import { PLAYERS_SERVICE_TOKEN } from 'src/modules/players/utils/playersServiceToken';
import { IPlayersRepositories } from 'src/modules/players/domain/repositories/IPlayers.repositories';

@Injectable()
export class AnalyzeTransactionsService {
  private readonly logger = new Logger(AnalyzeTransactionsService.name);

  constructor(
    @Inject(ANALYTICS_SERVICE_TOKEN)
    private readonly analyticsRepository: IAnalyticsRepositories,
    @Inject(PLAYERS_SERVICE_TOKEN)
    private readonly playersRepository: IPlayersRepositories,
    private readonly httpService: HttpService,
    private readonly createLogService: CreateLogService,
  ) { }

  private async fetchTransactions(): Promise<ApiDepositTransactionDto[]> {
    const url = 'https://option-api.asap.codes/intarget/players/transactions';
    const params = {
      from: new Date(new Date().setDate(new Date().getDate() - 1)),
      to: new Date(),
      tenantId: '01JBWST3JJ2V79X9C9AR899DQ1',
    };
    const headers = { 'api-key': 'POXWHSL829XN' };

    const response = await firstValueFrom(
      this.httpService.get<ApiDepositTransactionDto[]>(url, { params, headers }),
    );
    return response.data;
  }

  // @Cron('*/1 * * * *')
  // async runTestAnalysis() {
  //   await this.runDailyAnalysis();
  // }

  @Cron('0 4 * * *')
  async runDailyAnalysis() {
    try {
      const transactions = await this.fetchTransactions();
      let processedCount = 0;
      let skippedCount = 0;
      let errorCount = 0;

      this.logger.log(`Iniciando processamento de ${transactions.length} transações...`);

      for (const transaction of transactions) {
        try {
          const player = await this.playersRepository.findPlayerByExternalId(transaction.player_id);

          if (!player) {
            skippedCount++;
            continue;
          }

          await this.analyticsRepository.upsertDeposit({
            transactionId: transaction.id,
            amount: Math.round(transaction.amount * 100),
            method: transaction.comment.includes("PIX") ? "PIX" : "CRYPTO",
            date: transaction.created_at,
            currency: transaction.currency,
            playerId: player.id,
          });

          processedCount++;
        } catch (transactionError) {
          errorCount++;
        }
      }

      this.logger.log(`Processamento de Transactions concluído. 
      - Total: ${transactions.length} 
      - Processadas com sucesso: ${processedCount} 
      - Ignoradas: ${skippedCount}
      - Falhas: ${errorCount}`);

    } catch (error) {
      this.logger.error('Falha geral ao processar transações', error.stack);
      await this.createLogService.execute({
        logStatus: LogStatus.FAILED,
        logType: LogType.ANALYTICS,
        message: error.message,
        payload: { stack: error.stack },
      });
    }
  }
}

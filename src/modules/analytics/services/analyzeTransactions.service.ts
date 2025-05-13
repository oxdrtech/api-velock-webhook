// import { Inject, Injectable, Logger } from '@nestjs/common';
// import { HttpService } from '@nestjs/axios';
// import { Cron } from '@nestjs/schedule';
// import { firstValueFrom } from 'rxjs';
// import { IAnalyticsRepositories } from '../domain/repositories/IAnalyticsRepositories';
// import { Deposit, LogStatus, LogType, Player } from '@prisma/client';
// import { CreateLogService } from 'src/modules/logs/services/createLog.service';
// import { ANALYTICS_SERVICE_TOKEN } from '../utils/analyticsServiceToken';
// import { ApiDepositTransactionDto } from '../domain/dto/api-deposit-transaction.dto';
// import { PLAYERS_SERVICE_TOKEN } from 'src/modules/players/utils/playersServiceToken';
// import { IPlayersRepositories } from 'src/modules/players/domain/repositories/IPlayers.repositories';

// @Injectable()
// export class AnalyzeTransactionsService {
//   private readonly logger = new Logger(AnalyzeTransactionsService.name);

//   constructor(
//     @Inject(ANALYTICS_SERVICE_TOKEN)
//     private readonly analyticsRepository: IAnalyticsRepositories,
//     @Inject(PLAYERS_SERVICE_TOKEN)
//     private readonly playersRepository: IPlayersRepositories,
//     private readonly httpService: HttpService,
//     private readonly createLogService: CreateLogService,
//   ) { }

//   private async fetchTransactions(): Promise<ApiDepositTransactionDto[]> {
//     const url = 'https://option-api.asap.codes/intarget/players/transactions';
//     const now = new Date();
//     const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
//     const params = {
//       from: oneHourAgo.toISOString(), // exemplo: '2025-05-13T13:00:00.000Z'
//       to: now.toISOString(),
//       // from: new Date(new Date().setDate(new Date().getDate() - 1)),
//       // to: new Date(),
//       tenantId: '01JBWST3JJ2V79X9C9AR899DQ1',
//     };
//     const headers = { 'api-key': 'POXWHSL829XN' };

//     const response = await firstValueFrom(
//       this.httpService.get<ApiDepositTransactionDto[]>(url, { params, headers }),
//     );
//     return response.data;
//   }

//   private mapToPlayerDomain(apiDeposit: ApiDepositTransactionDto): Partial<Player> {
//     return {
//       externalId: apiDeposit.player_id,
//       tenantId: apiDeposit.tenantId,
//       email: `${apiDeposit.player_id}@temp.com`, // Email temporário único
//       name: 'Unknown', // Valor padrão
//       country: 'Unknown', // Valor padrão
//       date: new Date(), // Data atual
//       playerStatus: 'NEW'
//     };
//   }

//   private mapToDepositDomain(apiDeposit: ApiDepositTransactionDto): Partial<Deposit> {
//     return {
//       playerId: apiDeposit.player_id,
//       transactionId: apiDeposit.id,
//       amount: apiDeposit.amount,
//       currency: apiDeposit.currency,
//       depositStatus: "APPROVED",
//       date: new Date(apiDeposit.created_at),
//     };
//   }

//   private async ensurePlayerExists(playerId: string, depositData: ApiDepositTransactionDto): Promise<Player> {
//     let player = await this.playersRepository.findPlayerByExternalId(playerId);
//     if (player) return player;

//     try {
//       const playerData = this.mapToPlayerDomain(depositData);
//       return await this.playersRepository.createPlayer(playerData as Player);
//     } catch (error) {
//       this.logger.warn(`Possível condição de corrida ao criar player ${playerId}: ${error.message}`);
//       return await this.playersRepository.findPlayerByExternalId(playerId);
//     }
//   }


//   @Cron('*/1 * * * *') // Roda a cada 1 minuto (para testes)
//   async runTestAnalysis() {
//     await this.runDailyAnalysis();
//   }

//   @Cron('59 23 * * *') // Executa diariamente às 23:59
//   async runDailyAnalysis() {
//     try {
//       const transactions = await this.fetchTransactions();

//       await Promise.all(
//         transactions.map(async (transaction) => {
//           try {
//             const player = await this.ensurePlayerExists(transaction.player_id, transaction);
//             const deposit = this.mapToDepositDomain(transaction);
//             await this.analyticsRepository.upsertDeposit(deposit as Deposit);

//             this.logger.debug(`Depósito ${transaction.id} processado para player ${player.id}`);
//           } catch (error) {
//             this.logger.error(`Erro ao processar transação ${transaction.id}`, {
//               error: error.message,
//               playerId: transaction.player_id,
//             });
//           }
//         }),
//       );

//       this.logger.log(`Processadas ${transactions.length} transações com sucesso.`);
//       await this.createLogService.execute({
//         logStatus: LogStatus.SUCCESS,
//         logType: LogType.ANALYTICS,
//         message: `Processadas ${transactions.length} transações.`,
//       });
//     } catch (error) {
//       this.logger.error('Falha na análise de transações', error.stack);
//       await this.createLogService.execute({
//         logStatus: LogStatus.FAILED,
//         logType: LogType.ANALYTICS,
//         message: `Falha ao processar transações: ${error.message}`,
//         payload: { stack: error.stack },
//       });
//     }
//   }
// }

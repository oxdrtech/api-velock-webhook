import { Inject, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as cron from 'node-cron';
import { firstValueFrom } from 'rxjs';
import { IAnalyticsRepositories } from '../domain/repositories/IAnalyticsRepositories';
import { LogStatus, LogType } from '@prisma/client';
import { CreateLogService } from 'src/modules/logs/services/createLog.service';
import { ANALYTICS_SERVICE_TOKEN } from '../utils/analyticsServiceToken';
import { ApiPlayerContactDto } from '../domain/dto/api-player-contact.dto copy';
import { IPlayersRepositories } from 'src/modules/players/domain/repositories/IPlayers.repositories';
import { PLAYERS_SERVICE_TOKEN } from 'src/modules/players/utils/playersServiceToken';

@Injectable()
export class AnalyzeContactsService {
  private readonly logger = new Logger(AnalyzeContactsService.name);

  constructor(
    @Inject(ANALYTICS_SERVICE_TOKEN)
    private readonly analyticsRepository: IAnalyticsRepositories,
    @Inject(PLAYERS_SERVICE_TOKEN)
    private readonly playersRepository: IPlayersRepositories,
    private readonly httpService: HttpService,
    private readonly createLogService: CreateLogService,
  ) { }

  onModuleInit() {
    // Executa todos os dias às 3h da manhã (0 3 * * *)
    cron.schedule('0 3 * * *', () => {
      this.logger.log('Iniciando análise diária de contacts (via node-cron)...');
      this.runDailyAnalysis();
    });

    // Se quiser ativar um cron de teste (a cada minuto), descomente abaixo:
    // cron.schedule('* * * * *', () => {
    //   this.logger.log('Executando análise de teste de contacts...');
    //   this.runDailyAnalysis();
    // });
  }

  private async fetchContacts(): Promise<ApiPlayerContactDto[]> {
    const url = 'https://option-api.asap.codes/intarget/players';
    const params = {
      from: new Date(new Date().setDate(new Date().getDate() - 1)),
      to: new Date(),
      tenantId: '01JBWST3JJ2V79X9C9AR899DQ1',
    };
    const headers = { 'api-key': 'POXWHSL829XN' };

    const response = await firstValueFrom(
      this.httpService.get<ApiPlayerContactDto[]>(url, { params, headers }),
    );
    return response.data;
  }

  async runDailyAnalysis() {
    try {
      const contacts = await this.fetchContacts();
      let createdCount = 0;
      let updatedCount = 0;
      let errorCount = 0;

      for (const contact of contacts) {
        try {
          const player = await this.playersRepository.findPlayerByExternalId(contact.id);
          await this.analyticsRepository.upsertPlayer({
            externalId: contact.id,
            affiliateId: contact.ref_code,
            tenantId: contact.tenantId,
            email: player?.email || `${contact.id}-${contact.first_name}@$temp.com`,
            date: contact.registered_at,
          });

          player ? updatedCount++ : createdCount++;
        } catch (contactsError) {
          errorCount++;
        }
      }

      this.logger.log(`Processamento de Contacts concluído. 
      - Total: ${contacts.length}
      - Criados: ${createdCount}
      - Atualizados: ${updatedCount}
      - Erros: ${errorCount}`);

    } catch (error) {
      this.logger.error('Failed to analyze contacts', error);
      await this.createLogService.execute({
        logStatus: LogStatus.FAILED,
        logType: LogType.ANALYTICS,
        message: error.message,
        payload: { stack: error.stack },
      });
    }
  }
}

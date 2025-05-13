import { Inject, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Cron } from '@nestjs/schedule';
import { firstValueFrom } from 'rxjs';
import { IAnalyticsRepositories } from '../domain/repositories/IAnalyticsRepositories';
import { LogStatus, LogType, Player } from '@prisma/client';
import { CreateLogService } from 'src/modules/logs/services/createLog.service';
import { ANALYTICS_SERVICE_TOKEN } from '../utils/analyticsServiceToken';
import { ApiPlayerContactDto } from '../domain/dto/api-player-contact.dto copy';

@Injectable()
export class AnalyzeContactsService {
  private readonly logger = new Logger(AnalyzeContactsService.name);

  constructor(
    @Inject(ANALYTICS_SERVICE_TOKEN)
    private readonly analyticsRepository: IAnalyticsRepositories,
    private readonly httpService: HttpService,
    private readonly createLogService: CreateLogService,
  ) { }

  private async fetchContacts(): Promise<ApiPlayerContactDto[]> {
    const url = 'https://option-api.asap.codes/intarget/players/contacts';
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

  private mapToPlayerDomain(apiPlayer: ApiPlayerContactDto): Player {
    return {
      externalId: apiPlayer.player_id,
      tenantId: apiPlayer.tenantId,
      email: apiPlayer.email,
      phone: apiPlayer.phone,
    } as Player;
  }

  @Cron('*/1 * * * *') // Roda a cada 1 minuto (para testes)
  async runTestAnalysis() {
    await this.runDailyAnalysis();
  }

  @Cron('59 23 * * *')
  async runDailyAnalysis() {
    try {
      const contacts = await this.fetchContacts();

      await Promise.all(
        contacts.map(async (contact) => {
          const player = this.mapToPlayerDomain(contact);
          await this.analyticsRepository.upsertPlayer(player);
        })
      );

      this.logger.log(`Successfully processed ${contacts.length} players`);
    } catch (error) {
      this.logger.error('Failed to analyze contacts', error);
      await this.createLogService.execute({
        logStatus: LogStatus.FAILED,
        logType: LogType.ANALYTICS,
        message: error.message,
      });
    }
  }
}

import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateDepositService } from '../services/createDeposit.service';
import { FindDepositByIdService } from '../services/findDepositById.service';
import { CreateDepositEventDto } from '../domain/dto/create-deposit-event.dto';
import { FindDepositsByPlayerIdService } from '../services/findDepositsByPlayerId.service';
import { PaydDepositEventDto } from '../domain/dto/payd-deposit-event.dto';
import { PaydDepositService } from '../services/paydDeposit.service';
import { FindDepositByTransactionIdService } from '../services/findDepositByTransactionId.service';
import { FindDepositsService } from '../services/findDeposits.service';
import { FilterParams } from 'src/shared/types/filterParams';

@Controller('deposits')
export class DepositsController {
  constructor(
    private readonly createDepositService: CreateDepositService,
    private readonly findDepositByIdService: FindDepositByIdService,
    private readonly findDepositByTransactionIdService: FindDepositByTransactionIdService,
    private readonly findDepositsByPlayerIdService: FindDepositsByPlayerIdService,
    private readonly findDepositsService: FindDepositsService,
    private readonly paydDepositService: PaydDepositService,
  ) { }

  @Post('create')
  createDeposit(
    @Body() data: CreateDepositEventDto,
  ) {
    return this.createDepositService.execute(data);
  }

  @Get(':id')
  findDepositById(
    @Param('id') id: string,
  ) {
    return this.findDepositByIdService.execute(id);
  }

  @Get('transactionId/:transactionId')
  findDepositByTransactionId(
    @Param('transactionId') transactionId: string,
  ) {
    return this.findDepositByTransactionIdService.execute(transactionId);
  }

  @Get('depositsByPlayerId/:playerId')
  findDepositsByPlayerExternalId(
    @Param('playerId') playerId: string,
  ) {
    return this.findDepositsByPlayerIdService.execute(playerId);
  }

  @Get()
  findDeposits(
    @Query('affiliates') affiliates?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const filters: FilterParams = {
      affiliateIds: affiliates?.split(','),
      startDate: startDate ? new Date(`${startDate}T00:00:00-03:00`) : undefined,
      endDate: endDate ? new Date(`${endDate}T23:59:59-03:00`) : undefined
    }
    return this.findDepositsService.execute(filters);
  }

  @Post('payd')
  paydDeposit(
    @Body() data: PaydDepositEventDto,
  ) {
    return this.paydDepositService.execute(data);
  }
}

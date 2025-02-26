import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateDepositService } from '../services/createDeposit.service';
import { FindDepositByIdService } from '../services/findDepositById.service';
import { CreateDepositEventDto } from '../domain/dto/create-deposit-event.dto';
import { FindDepositsByPlayerIdService } from '../services/findDepositsByPlayerId.service';
import { PaydDepositEventDto } from '../domain/dto/payd-deposit-event.dto';
import { PaydDepositService } from '../services/paydDeposit.service';
import { FindDepositByTransactionIdService } from '../services/findDepositByTransactionId.service';

@Controller('deposits')
export class DepositsController {
  constructor(
    private readonly createDepositService: CreateDepositService,
    private readonly findDepositByIdService: FindDepositByIdService,
    private readonly findDepositByTransactionIdService: FindDepositByTransactionIdService,
    private readonly findDepositsByPlayerIdService: FindDepositsByPlayerIdService,
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

  @Post('payd')
  paydDeposit(
    @Body() data: PaydDepositEventDto,
  ) {
    return this.paydDepositService.execute(data);
  }
}

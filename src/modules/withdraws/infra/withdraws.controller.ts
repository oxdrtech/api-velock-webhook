import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CreateWithdrawService } from '../services/createWithdraw.service';
import { FindWithdrawByIdService } from '../services/findWithdrawById.service';
import { FindWithdrawByTransactionIdService } from '../services/findWithdrawByTransactionId.service';
import { CreateWithdrawEventDto } from '../domain/dto/create-withdraw-event.dto';
import { FindWithdrawsByPlayerIdService } from '../services/findWithdrawsByPlayerId.service';

@Controller('withdraws')
export class WithdrawsController {
  constructor(
    private readonly createWithdrawService: CreateWithdrawService,
    private readonly findWithdrawByIdService: FindWithdrawByIdService,
    private readonly findWithdrawByTransactionIdService: FindWithdrawByTransactionIdService,
    private readonly findWithdrawsByPlayerIdService: FindWithdrawsByPlayerIdService,
  ) { }

  @Post('create')
  createWithdraw(
    @Body() data: CreateWithdrawEventDto,
  ) {
    return this.createWithdrawService.execute(data);
  }

  @Get(':id')
  findWithdrawById(
    @Param('id') id: string,
  ) {
    return this.findWithdrawByIdService.execute(id);
  }

  @Get('transactionId/:transactionId')
  findWithdrawByTransactionId(
    @Param('transactionId') transactionId: string,
  ) {
    return this.findWithdrawByTransactionIdService.execute(transactionId);
  }

  @Get('withdrawsByPlayer/:playerId')
  findWithdrawsByPlayerId(
    @Param('playerId') playerId: string,
  ) {
    return this.findWithdrawsByPlayerIdService.execute(playerId);
  }
}

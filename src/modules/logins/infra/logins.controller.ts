import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateLoginService } from '../services/createLogin.service';
import { FindLoginsByPlayerIdService } from '../services/findLoginsByPlayerId.service';
import { CreateLoginEventDto } from '../domain/dto/create-login-event.dto';
import { FindLoginByIdService } from '../services/findLoginById.service';

@Controller('logins')
export class LoginsController {
  constructor(
    private readonly createLoginService: CreateLoginService,
    private readonly findLoginByIdService: FindLoginByIdService,
    private readonly findLoginsByPlayerIdService: FindLoginsByPlayerIdService,
  ) { }

  @Post('create')
  createLogin(
    @Body() data: CreateLoginEventDto,
  ) {
    return this.createLoginService.execute(data);
  }

  @Get(':id')
  findLoginById(
    @Param('id') id: string,
  ) {
    return this.findLoginByIdService.execute(id);
  }

  @Get('loginsByPlayer/:playerId')
  findLoginsByPlayerId(
    @Param('playerId') playerId: string,
  ) {
    return this.findLoginsByPlayerIdService.execute(playerId);
  }
}

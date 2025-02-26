import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { CreatePlayerService } from '../services/createPlayer.service';
import { FindPlayerByEmailService } from '../services/findPlayerByEmail.service';
import { UpdatePlayerDto } from '../domain/dto/update-player.dto';
import { UpdatePlayerService } from '../services/updatePlayer.service';
import { FindPlayersService } from '../services/findPlayers.service';
import { FindPlayerByExternalIdService } from '../services/findPlayerByExternalId.service';
import { CreatePlayerEventDto } from '../domain/dto/create-player-event.dto';
import { FindPlayerByIdService } from '../services/findPlayerById.service';

@Controller('players')
export class PlayersController {
  constructor(
    private readonly createPlayerService: CreatePlayerService,
    private readonly FindPlayerByIdService: FindPlayerByIdService,
    private readonly findPlayerByExternalIdService: FindPlayerByExternalIdService,
    private readonly findPlayerByEmailService: FindPlayerByEmailService,
    private readonly findPlayersService: FindPlayersService,
    private readonly updatePlayerService: UpdatePlayerService,
  ) { }

  @Post('create')
  createPlayer(
    @Body() data: CreatePlayerEventDto,
  ) {
    return this.createPlayerService.execute(data);
  }

  @Get(':id')
  findPlayerById(
    @Param('id') id: string,
  ) {
    return this.FindPlayerByIdService.execute(id);
  }

  @Get('externalId/:externalId')
  findPlayerByExternalId(
    @Param('externalId') externalId: string,
  ) {
    return this.findPlayerByExternalIdService.execute(externalId);
  }

  @Get('email/:email')
  findPlayerByEmail(
    @Param('email') email: string,
  ) {
    return this.findPlayerByEmailService.execute(email);
  }

  @Get()
  findPlayers() {
    return this.findPlayersService.execute();
  }

  @Patch('update/:id')
  updatePlayer(
    @Param('id') id: string,
    @Body() data: UpdatePlayerDto,
  ) {
    return this.updatePlayerService.execute(id, data);
  }
}

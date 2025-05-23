import { Controller, Post, Body, Get, Param, Patch, Query } from '@nestjs/common';
import { CreatePlayerService } from '../services/createPlayer.service';
import { FindPlayerByEmailService } from '../services/findPlayerByEmail.service';
import { UpdatePlayerDto } from '../domain/dto/update-player.dto';
import { UpdatePlayerService } from '../services/updatePlayer.service';
import { FindPlayersService } from '../services/findPlayers.service';
import { FindPlayerByExternalIdService } from '../services/findPlayerByExternalId.service';
import { CreatePlayerEventDto } from '../domain/dto/create-player-event.dto';
import { FindPlayerByIdService } from '../services/findPlayerById.service';
import { FindPlayerAffiliateIdsService } from '../services/findPlayersAffiliateIds.service';
import { FilterParams } from 'src/shared/types/filterParams';

@Controller('players')
export class PlayersController {
  constructor(
    private readonly createPlayerService: CreatePlayerService,
    private readonly FindPlayerByIdService: FindPlayerByIdService,
    private readonly findPlayerByExternalIdService: FindPlayerByExternalIdService,
    private readonly findPlayerByEmailService: FindPlayerByEmailService,
    private readonly findPlayersService: FindPlayersService,
    private readonly findPlayerAffiliateIdsService: FindPlayerAffiliateIdsService,
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
  findPlayers(
    @Query('affiliates') affiliates?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('onlyAffiliateIds') onlyAffiliateIds?: boolean,
  ) {
    if (onlyAffiliateIds) {
      return this.findPlayerAffiliateIdsService.execute();
    }
    const filters: FilterParams = {
      affiliateIds: affiliates?.split(','),
      startDate: startDate ? new Date(startDate + 'T00:00:00.000Z') : undefined,
      endDate: endDate ? new Date(endDate + 'T23:59:59.999Z') : undefined
    }
    return this.findPlayersService.execute(filters);
  }

  @Patch('update/:id')
  updatePlayer(
    @Param('id') id: string,
    @Body() data: UpdatePlayerDto,
  ) {
    return this.updatePlayerService.execute(id, data);
  }
}

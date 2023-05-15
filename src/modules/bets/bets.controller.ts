import {
  Controller,
  Get,
  UseGuards,
  Query,
  Put,
  Param,
  Body,
} from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { BetsService } from './services/bets.service';
import { AuthGuard, RoleGuard } from '../auth/guards';
import { Roles } from '../auth/decorators/role.decorator';
import { ROLE } from '../auth/enums/role.enum';
import { GetDto, PutDto } from './dto';

@Controller('bets')
@ApiTags('Bets')
@ApiBearerAuth('Authorization')
export class BetsController {
  constructor(private readonly betsService: BetsService) {}

  /**
   * Get Bets
   */
  @Get()
  @ApiHeader({
    name: 'Role',
    description: 'User role',
  })
  @Roles(ROLE.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  getBets(@Query() params: GetDto) {
    return this.betsService.getBets(params);
  }

  /**
   * Update bets
   * @param {number} id
   * @param {PutDto} body
   */
  @Put(':id')
  @ApiHeader({
    name: 'Role',
    description: 'User role',
  })
  @Roles(ROLE.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  putBets(@Param('id') id: number, @Body() body: PutDto) {
    return this.betsService.putBets(id, body.status);
  }
}

import {
  Controller,
  Get,
  UseGuards,
  Post,
  Put,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import {
  UsersService,
  TransactionsService,
  BalanceService,
  BetsService,
} from './services';
import { AuthGuard, RoleGuard } from '../auth/guards';
import { Roles } from '../auth/decorators/role.decorator';
import { ROLE } from '../auth/enums/role.enum';
import {
  PostDto,
  PutDto,
  PostTransactionsDto,
  GetTransactionsDto,
  GetBalanceDto,
  PostBetsDto,
} from './dto';
import { IResultSave } from './interfaces';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth('Authorization')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly transactionsService: TransactionsService,
    private readonly balanceService: BalanceService,
    private readonly betsService: BetsService,
  ) {}

  /**
   * Get users
   */
  @Get()
  @ApiHeader({
    name: 'Role',
    description: 'User role',
  })
  @Roles(ROLE.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  getUsers() {
    return this.usersService.getUsers();
  }

  /**
   * Create users
   * @param {PostDto} body
   * @returns {Promise<IResultSave>}
   */
  @Post()
  async postUsers(@Body() body: PostDto): Promise<IResultSave> {
    return this.usersService.postUsers(body);
  }

  /**
   * Update users
   * @param {number} id
   * @param {PutDto} body
   */
  @Put(':id')
  @ApiHeader({
    name: 'Role',
    description: 'User role',
  })
  @Roles(ROLE.ADMIN, ROLE.USER)
  @UseGuards(AuthGuard, RoleGuard)
  async putUsers(
    @Param('id') id: number,
    @Body() body: PutDto,
  ): Promise<IResultSave> {
    return this.usersService.putUsers(id, body);
  }

  /**
   * Create transactions
   * @param {PostTransactionsDto} body
   * @returns {Promise<any>}
   */
  @ApiHeader({
    name: 'Role',
    description: 'User role',
  })
  @Roles(ROLE.ADMIN, ROLE.USER)
  @UseGuards(AuthGuard, RoleGuard)
  @Post('transactions')
  async postUsersTransactions(@Body() body: PostTransactionsDto): Promise<any> {
    return this.transactionsService.postUsersTransactions(body);
  }

  /**
   * Get transactions for users
   * @param {GetTransactionsDto} params
   */
  @ApiHeader({
    name: 'Role',
    description: 'User role',
  })
  @Roles(ROLE.ADMIN, ROLE.USER)
  @UseGuards(AuthGuard, RoleGuard)
  @Get('transactions')
  async getUsersTransactions(@Query() params: GetTransactionsDto) {
    return this.transactionsService.getUsersTransactions(params);
  }

  /**
   * Get user balance
   * @param {GetBalanceDto} params
   */
  @ApiHeader({
    name: 'Role',
    description: 'User role',
  })
  @Roles(ROLE.ADMIN, ROLE.USER)
  @UseGuards(AuthGuard, RoleGuard)
  @Get('balance')
  async getUsersBalances(@Query() params: GetBalanceDto) {
    return this.balanceService.getUsersBalances(params);
  }

  /**
   * Create bets for users
   * @param {PostBetsDto} body
   */
  @Post('bets')
  @ApiHeader({
    name: 'Role',
    description: 'User role',
  })
  @Roles(ROLE.USER)
  @UseGuards(AuthGuard, RoleGuard)
  postBetsUsers(@Body() body: PostBetsDto) {
    return this.betsService.postBetsUsers(body);
  }
}

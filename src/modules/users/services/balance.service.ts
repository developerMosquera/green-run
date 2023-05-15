import {
  Injectable,
  InternalServerErrorException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { TransactionsService } from './';
import { Transactions, Users, Balances } from '../entities';
import { IGet, IGetBalance } from '../interfaces';
import { ROLE } from '../../auth/enums/role.enum';
import { TRANSACTION_CATEGORIES } from '../enums';

@Injectable()
export class BalanceService {
  constructor(
    @InjectRepository(Transactions)
    private readonly transactionsRepository: Repository<Transactions>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(Balances)
    private readonly balancesRepository: Repository<Balances>,
    @Inject('REQUEST') private request: Request,
    @Inject(TransactionsService)
    private readonly transactionsService: TransactionsService,
  ) {}

  async getUser(): Promise<IGet> {
    const reqUser = this.request.headers.user;
    return await this.usersRepository.findOne({
      where: { uid: reqUser['uid'] },
    });
  }

  async getUsersBalances(params: IGetBalance): Promise<Balances> {
    try {
      const reqRole = this.request.headers.role;
      if (reqRole.toString() === ROLE.USER) {
        const user = await this.getUser();
        params.user_id = user.id;
      }

      const transactions = await this.transactionsRepository.find({
        relations: ['user'],
        where: {
          user: {
            id: params.user_id,
          },
        },
      });

      const totalWinning =
        await this.transactionsService.processTransactionsWinning(transactions);
      const userBalance = await this.transactionsService.putUsersBalances(
        totalWinning,
        params.user_id,
        TRANSACTION_CATEGORIES.WINNING,
      );

      return userBalance;
    } catch (error) {
      throw new InternalServerErrorException('Process failed');
    }
  }
}

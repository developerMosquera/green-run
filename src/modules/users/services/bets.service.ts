import {
  Injectable,
  InternalServerErrorException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { TransactionsService } from './transactions.service';
import { Users, Balances, UsersBets } from '../entities';
import { Bets } from '../../bets/entities';
import { IGet, IPostBets } from '../interfaces';
import { TRANSACTION_CATEGORIES, STATUS_BETS } from '../enums';

@Injectable()
export class BetsService {
  constructor(
    @InjectRepository(Bets)
    private readonly betsRepository: Repository<Bets>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(Balances)
    private readonly balanceRepository: Repository<Balances>,
    @InjectRepository(UsersBets)
    private readonly usersBetsRepository: Repository<UsersBets>,
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

  async postBetsUsers(
    data: IPostBets,
  ): Promise<{ process: number; notProcess: Array<any> }> {
    try {
      const noProcess = [];
      for (const item of data.userBets) {
        const saveBetsUsers = await this.saveBetsUsers(
          item.user_id,
          item.amount,
          item.bet_id,
        );
        if (!saveBetsUsers) {
          noProcess.push(item.user_id);
        }
      }

      return {
        process: data.userBets.length - noProcess.length,
        notProcess: noProcess,
      };
    } catch (error) {
      throw new InternalServerErrorException('Process failed');
    }
  }

  async saveBetsUsers(
    user_id: number,
    amount: number,
    bet_id: number,
  ): Promise<boolean> {
    const user: Users = await this.getUsers(user_id);
    const bets: Bets = await this.getBets(bet_id);

    if (user && bets) {
      const isValidBalance = await this.validateBalanceUser(user_id, amount);
      if (isValidBalance) {
        const createBetsUsers = await this.usersBetsRepository.create({
          amount: amount,
          User: user,
          Bet: bets,
          users_bets_state: STATUS_BETS.OPEN,
        });
        await this.usersBetsRepository.save(createBetsUsers);

        return true;
      }
    }

    return false;
  }

  async getUsers(user_id): Promise<Users> {
    return this.usersRepository.findOne({
      where: {
        id: user_id,
      },
    });
  }

  async getBets(bet_id): Promise<Bets> {
    return await this.betsRepository.findOne({
      where: {
        id: bet_id,
        bet_state: STATUS_BETS.ACTIVE,
      },
    });
  }

  async validateBalanceUser(user_id: number, amount: number): Promise<boolean> {
    const balance: Balances = await this.balanceRepository.findOne({
      where: {
        user: {
          id: user_id,
        },
      },
    });

    if (balance.balance >= amount) {
      await this.transactionsService.postUsersTransactions({
        amount: amount,
        category: TRANSACTION_CATEGORIES.BET,
      });

      return true;
    }

    return false;
  }
}

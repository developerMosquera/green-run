import {
  Injectable,
  InternalServerErrorException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { Transactions, Users, Balances } from '../entities';
import {
  IPostTransactions,
  IGet,
  IResultSaveTransactions,
  IGetTransactions,
} from '../interfaces';
import { ROLE } from '../../auth/enums/role.enum';
import { TRANSACTION_CATEGORIES, STATUS } from '../enums';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transactions)
    private readonly transactionsRepository: Repository<Transactions>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @Inject('REQUEST') private request: Request,
    @InjectRepository(Balances)
    private readonly balancesRepository: Repository<Balances>,
  ) {}

  async getUser(): Promise<IGet> {
    const reqUser = this.request.headers.user;
    return await this.usersRepository.findOne({
      where: { uid: reqUser['uid'] },
    });
  }

  async postUsersTransactions(
    data: IPostTransactions,
  ): Promise<IResultSaveTransactions> {
    try {
      const user = await this.getUser();

      const transactionsCreate = this.transactionsRepository.create({
        amount: data.amount,
        category: data.category,
        user: user,
        transactions_state:
          data.category === TRANSACTION_CATEGORIES.WINNING
            ? STATUS.ACTIVE
            : STATUS.INACTIVE,
      });
      const transactionsSave = await this.transactionsRepository.save(
        transactionsCreate,
      );

      await this.putUsersBalances(data.amount, user.id, data.category);

      return {
        id: transactionsSave.id,
        amount: transactionsSave.amount,
        category: transactionsSave.category,
        transactions_state: transactionsSave.transactions_state,
        created_at: transactionsSave.created_at,
      };
    } catch (error) {
      throw new InternalServerErrorException('Process failed');
    }
  }

  async getUsersTransactions(
    params: IGetTransactions,
  ): Promise<Transactions[]> {
    try {
      const reqRole = this.request.headers.role;
      if (reqRole.toString() === ROLE.USER) {
        const user = await this.getUser();
        params.user_id = user.id;
      }

      return this.transactionsRepository.find({
        relations: ['user'],
        where: {
          category: params.category,
          user: {
            id: params.user_id,
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Process failed');
    }
  }

  async processTransactionsWinning(
    transactions: Transactions[],
  ): Promise<number> {
    const transactionsWinning = transactions.filter(
      (item) =>
        item.category === TRANSACTION_CATEGORIES.WINNING &&
        item.transactions_state === STATUS.ACTIVE,
    );

    let totalWinning = 0;
    const idsProcess = [];
    transactionsWinning.forEach((item) => {
      totalWinning += item.amount;
      idsProcess.push(item.id);
    });

    await this.transactionsRepository
      .createQueryBuilder()
      .update(Transactions)
      .set({ transactions_state: 0 })
      .whereInIds(idsProcess)
      .execute();

    return totalWinning;
  }

  async putUsersBalances(
    amount: number,
    user_id: number,
    category: string,
  ): Promise<Balances> {
    const currentBalance: Balances = await this.balancesRepository.findOne({
      relations: ['user'],
      where: { user: { id: user_id } },
    });

    const balanceUpate = currentBalance;
    if (category === TRANSACTION_CATEGORIES.WINNING) {
      balanceUpate.balance += amount;
    }

    if (category === TRANSACTION_CATEGORIES.BET) {
      balanceUpate.balance -= amount;
    }

    if (category === TRANSACTION_CATEGORIES.DEPOSIT) {
      balanceUpate.balance += amount;
    }

    if (category === TRANSACTION_CATEGORIES.WITHDRAW) {
      balanceUpate.balance -= amount;
    }

    await this.balancesRepository.save(balanceUpate);

    return balanceUpate;
  }
}

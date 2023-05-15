import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bets } from '../entities';
import { UsersBets, Transactions } from '../../users/entities';
import { IGet } from '../interfaces';
import { STATUS_BETS, TRANSACTION_CATEGORIES, STATUS } from '../../users/enums';

@Injectable()
export class BetsService {
  constructor(
    @InjectRepository(Bets)
    private readonly betsRepository: Repository<Bets>,
    @InjectRepository(UsersBets)
    private readonly usersBetsRepository: Repository<UsersBets>,
    @InjectRepository(Transactions)
    private readonly transactionsRepository: Repository<Transactions>,
  ) {}

  /**
   * Get bets
   * @param {IGet} params
   * @returns {Promise<Bets[]>}
   */
  async getBets(params: IGet): Promise<Bets[]> {
    return await this.betsRepository.find({
      relations: ['event'],
      where: {
        event: {
          id: params.event_id,
          name: params.sport,
        },
      },
    });
  }

  /**
   * Update bets
   * @param {number} id
   * @param {string} status
   * @returns {Promise<Bets>}
   */
  async putBets(id: number, status: string): Promise<Bets> {
    try {
      const bets: Bets = await this.betsRepository.findOne({
        where: {
          id: id,
          bet_state: STATUS_BETS.OPEN,
          event: {
            event_state: STATUS_BETS.ACTIVE,
          },
        },
      });

      if (bets) {
        bets.bet_state = status;

        await this.betsRepository.save(bets);
        await this.putBetsUsers(id, status);
      }

      return bets;
    } catch (error) {
      throw new InternalServerErrorException('Process failed');
    }
  }

  /**
   * Update bets users
   * @param {id} id
   * @param {string} status
   */
  async putBetsUsers(id: number, status: string) {
    const usersBets: UsersBets[] = await this.usersBetsRepository.find({
      relations: ['Bet', 'User'],
      where: {
        Bet: {
          id: id,
        },
      },
    });

    const idsUsersBets = [];
    usersBets.forEach((item) => {
      idsUsersBets.push(item.id);
    });

    await this.usersBetsRepository
      .createQueryBuilder()
      .update(UsersBets)
      .set({ users_bets_state: status })
      .whereInIds(idsUsersBets)
      .execute();

    if (status === STATUS_BETS.WON) {
      this.createTransactionsWinning(usersBets);
    }
  }

  /**
   * Process transactions winning
   * @param {UsersBets[]} usersBets
   */
  async createTransactionsWinning(usersBets: UsersBets[]) {
    for (const item of usersBets) {
      const totalWinning = item.amount * item.Bet.odd + item.amount;
      const transactionsCreate = await this.transactionsRepository.create({
        amount: totalWinning,
        category: TRANSACTION_CATEGORIES.WINNING,
        user: item.User,
        transactions_state: STATUS.ACTIVE,
      });
      await this.transactionsRepository.save(transactionsCreate);
    }
  }
}

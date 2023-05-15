import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  UsersService,
  TransactionsService,
  BalanceService,
  BetsService,
} from './services';
import { FirebaseService } from '../../firebase/firebase.service';
import { UsersController } from './users.controller';
import {
  Users,
  Countries,
  Cities,
  Balances,
  Transactions,
  UsersBets,
} from './entities';
import { Bets, Events } from '../bets/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Users,
      Countries,
      Cities,
      Balances,
      Transactions,
      Bets,
      Events,
      UsersBets,
    ]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    FirebaseService,
    TransactionsService,
    BalanceService,
    BetsService,
  ],
})
export class UsersModule {}

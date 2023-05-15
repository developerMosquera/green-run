import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BetsService } from './services/bets.service';
import { BetsController } from './bets.controller';
import { Events, Bets } from './entities';
import { Users, UsersBets, Transactions } from '../users/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Bets, Events, UsersBets, Transactions]),
  ],
  controllers: [BetsController],
  providers: [BetsService],
})
export class BetsModule {}

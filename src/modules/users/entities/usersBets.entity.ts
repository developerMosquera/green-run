import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from '.';
import { Bets } from '../../bets/entities';

@Entity()
export class UsersBets {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('double')
  amount: number;

  @Column({ length: 15 })
  users_bets_state: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Users, (user) => user.usersBets)
  @JoinColumn({ name: 'user_id' })
  User: Users;

  @ManyToOne(() => Bets, (bet) => bet.usersBets)
  @JoinColumn({ name: 'bet_id' })
  Bet: Bets;
}

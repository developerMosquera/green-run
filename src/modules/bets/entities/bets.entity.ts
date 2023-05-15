import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  UpdateDateColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Events } from './';
import { UsersBets } from '../../users/entities';

@Entity()
export class Bets {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('smallint')
  option: number;

  @Column({ length: 20 })
  name: string;

  @Column({ length: 20 })
  bet_state: string;

  @Column('float')
  odd: number;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Events, (event) => event.bets)
  @JoinColumn({ name: 'event_id' })
  event: Events;

  @OneToMany(() => UsersBets, (userBet) => userBet.Bet)
  usersBets: UsersBets[];
}

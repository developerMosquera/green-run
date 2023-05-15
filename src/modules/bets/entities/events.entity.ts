import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Bets } from './';
import { Users } from '../../users/entities';

@Entity()
export class Events {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20 })
  name: string;

  @Column({ length: 15 })
  event_state: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => Users, (user) => user.events)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @OneToMany(() => Bets, (bet) => bet.event)
  bets: Bets[];
}

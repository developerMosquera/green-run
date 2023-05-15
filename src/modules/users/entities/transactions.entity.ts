import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Users } from './users.entity';

@Entity()
export class Transactions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('double')
  amount: number;

  @Column({ length: 15 })
  category: string;

  @Column('smallint', { default: 1 })
  transactions_state: number;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Users, (user) => user.transactions)
  @JoinColumn({ name: 'user_id' })
  user: Users;
}

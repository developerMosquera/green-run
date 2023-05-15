import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Users } from './users.entity';

@Entity()
export class Balances {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('double', { default: 0 })
  balance: number;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => Users, (user) => user.balances)
  @JoinColumn({ name: 'user_id' })
  user: Users;
}

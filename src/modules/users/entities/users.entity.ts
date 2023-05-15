import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  ManyToOne,
  OneToOne,
  OneToMany,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Cities, Balances, Transactions, UsersBets } from './';
import { Events } from '../../bets/entities';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  @Index('uid')
  uid: string;

  @Column({ length: 50 })
  email: string;

  @Column({ length: 10 })
  role: string;

  @Column({ length: 20 })
  first_name: string;

  @Column({ length: 20 })
  last_name: string;

  @Column({ length: 20 })
  phone: string;

  @Column({ length: 20 })
  username: string;

  @Column({ length: 30 })
  address: string;

  @Column({ length: 2 })
  gender: string;

  @Column('date')
  birth_date: Date;

  @Column({ length: 50 })
  category: string;

  @Column({ length: 25 })
  document_id: string;

  @Column('smallint', { default: 1 })
  user_state: number;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  @UpdateDateColumn()
  updated_at: Date;

  @Column('smallint', { default: 0 })
  deleted: number;

  @Column('date', { nullable: true })
  deleted_at: Date;

  @ManyToOne(() => Cities, (cities) => cities.user)
  @JoinColumn({ name: 'city_id' })
  cities: Cities;

  @OneToOne(() => Balances, (balance) => balance.user)
  balances: Balances;

  @OneToMany(() => Transactions, (transactions) => transactions.user)
  transactions: Transactions[];

  @OneToMany(() => Events, (event) => event.user)
  events: Events[];

  @OneToMany(() => UsersBets, (userBet) => userBet.User)
  usersBets: UsersBets[];
}

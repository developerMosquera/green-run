import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Users } from './users.entity';
import { Countries } from './countries.entity';

@Entity()
export class Cities {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  name: string;

  @Column('smallint', { default: 1 })
  city_state: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @OneToMany(() => Users, (user) => user.cities)
  user: Users;

  @ManyToOne(() => Countries, (country) => country.city)
  @JoinColumn({ name: 'country_id' })
  country: Countries;
}

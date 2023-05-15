import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Cities } from './cities.entity';

@Entity()
export class Countries {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  name: string;

  @Column('smallint', { default: 1 })
  country_state: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @OneToMany(() => Cities, (city) => city.country)
  city: Cities;
}

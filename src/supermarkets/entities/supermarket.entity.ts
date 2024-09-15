import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import {CityEntity} from '../../cities/entities/city.entity';

@Entity('supermarkets')
export class SupermarketEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('decimal', { precision: 9, scale: 6 })
  latitud: number;

  @Column('decimal', { precision: 9, scale: 6 })
  longitud: number;

  @Column()
  website: string;

  @ManyToMany(() => CityEntity, (city) => city.supermarkets)
  cities: CityEntity[];
}

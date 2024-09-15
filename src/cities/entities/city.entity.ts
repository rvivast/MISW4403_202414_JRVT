import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import {SupermarketEntity} from '../../supermarkets/entities/supermarket.entity';

@Entity('cities')
export class CityEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  country: string;

  @Column()
  population: number;

  @ManyToMany(() => SupermarketEntity, (supermarket) => supermarket.cities)
  @JoinTable({
    name: 'cities_supermarkets',
    joinColumn: {
      name: 'cityId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'supermarketId',
      referencedColumnName: 'id',
    },
  })
  supermarkets: SupermarketEntity[];
}

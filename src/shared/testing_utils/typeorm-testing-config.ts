/* eslint-disable prettier/prettier */
/* archivo src/shared/testing-utils/typeorm-testing-config.ts*/
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityEntity } from '../../cities/entities/city.entity';
import { SupermarketEntity } from '../../supermarkets/entities/supermarket.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    // logging: ['query', 'error'],
    entities: [
      CityEntity,
      SupermarketEntity,
    ],
    synchronize: true,
    keepConnectionAlive: true,
  }),
  TypeOrmModule.forFeature([
    CityEntity,
    SupermarketEntity,
  ]),
];

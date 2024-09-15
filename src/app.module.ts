import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CitiesModule } from './cities/cities.module';
import { SupermarketsModule } from './supermarkets/supermarkets.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CitiesSupermarketsModule } from './cities-supermarkets/cities-supermarkets.module';
import { CityEntity } from './cities/entities/city.entity';
import { SupermarketEntity } from './supermarkets/entities/supermarket.entity';

@Module({
  imports: [CitiesModule, SupermarketsModule, CitiesSupermarketsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'parcial',
      entities: [
        CityEntity,
        SupermarketEntity
      ],
      dropSchema: false,
      synchronize: true,
      keepConnectionAlive: true,
    }),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

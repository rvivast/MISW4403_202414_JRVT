import { Module } from '@nestjs/common';
import { CitiesSupermarketsService } from './cities-supermarkets.service';
import { CitiesSupermarketsController } from './cities-supermarkets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityEntity } from 'src/cities/entities/city.entity';
import { SupermarketEntity } from 'src/supermarkets/entities/supermarket.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CityEntity, SupermarketEntity])],
  controllers: [CitiesSupermarketsController],
  providers: [CitiesSupermarketsService],
})
export class CitiesSupermarketsModule {}

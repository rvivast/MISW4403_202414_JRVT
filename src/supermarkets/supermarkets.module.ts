import { Module } from '@nestjs/common';
import { SupermarketsService } from './supermarkets.service';
import { SupermarketsController } from './supermarkets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupermarketEntity } from './entities/supermarket.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SupermarketEntity])],
  controllers: [SupermarketsController],
  providers: [SupermarketsService],
})
export class SupermarketsModule {}

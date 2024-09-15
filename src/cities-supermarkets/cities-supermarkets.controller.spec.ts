import { Test, TestingModule } from '@nestjs/testing';
import { CitiesSupermarketsController } from './cities-supermarkets.controller';
import { CitiesSupermarketsService } from './cities-supermarkets.service';

describe('CitiesSupermarketsController', () => {
  let controller: CitiesSupermarketsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CitiesSupermarketsController],
      providers: [CitiesSupermarketsService],
    }).compile();

    controller = module.get<CitiesSupermarketsController>(CitiesSupermarketsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

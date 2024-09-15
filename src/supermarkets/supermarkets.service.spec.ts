import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupermarketsService } from './supermarkets.service';
import { SupermarketEntity } from './entities/supermarket.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/testing_utils/typeorm-testing-config';

describe('SupermarketsService', () => {
  let service: SupermarketsService;
  let repository: Repository<SupermarketEntity>;
  let supermarketsList: SupermarketEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [
        SupermarketsService
      ],
    }).compile();

    service = module.get<SupermarketsService>(SupermarketsService);
    repository = module.get<Repository<SupermarketEntity>>(getRepositoryToken(SupermarketEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    await repository.clear();
    supermarketsList = [];
    for (let i = 0; i < 5; i++) {
      const supermarket: SupermarketEntity = await repository.save({
        latitud: faker.number.int({ min: 10, max: 100 }),
        longitud: faker.number.int({ min: 10, max: 100 }),
        name: faker.company.name(),
        website: faker.internet.url(),
        cities: [],
      });
      supermarketsList.push(supermarket);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all supermarkets', async () => {
    const supermarkets: SupermarketEntity[] = await service.findAll();
    expect(supermarkets).not.toBeNull();
    expect(supermarkets).toHaveLength(supermarketsList.length);
  });

  it('findOne should return a supermarket by id', async () => {
    const storedSupermarket: SupermarketEntity = supermarketsList[0];
    const supermarket: SupermarketEntity = await service.findOne(storedSupermarket.id);
    expect(supermarket).not.toBeNull();
    expect(supermarket.name).toEqual(storedSupermarket.name);
  });

  it('findOne should throw an exception for an invalid supermarket', async () => {
    await expect(service.findOne('0')).rejects.toThrow(NotFoundException);
  });

  it('create should return a new supermarket', async () => {
    const supermarket: SupermarketEntity = {
      id: '',
      latitud: faker.number.int({ min: 10, max: 100 }),
      longitud: faker.number.int({ min: 10, max: 100 }),
      name: faker.string.alphanumeric({ length: { min: 11, max: 15 } }),
      website: faker.internet.url(),
      cities: [],
    };

    const newSupermarket: SupermarketEntity = await service.create(supermarket);
    expect(newSupermarket).not.toBeNull();

    const storedSupermarket: SupermarketEntity = await repository.findOne({ where: { id: newSupermarket.id } });
    expect(storedSupermarket).not.toBeNull();
    expect(storedSupermarket.name).toEqual(newSupermarket.name);
  });

  it('create should throw an exception for a name with less than 10 characters', async () => {
    const supermarket: SupermarketEntity = {
      id: '',
      latitud: faker.number.int({ min: 10, max: 100 }),
      longitud: faker.number.int({ min: 10, max: 100 }),
      name: 'Short',
      website: faker.internet.url(),
      cities: [],
    };

    await expect(service.create(supermarket)).rejects.toThrow(BadRequestException);
  });

  it('update should modify a supermarket', async () => {
    const supermarket: SupermarketEntity = supermarketsList[0];
    supermarket.name = 'Updated Supermarket Name';

    const updatedSupermarket: SupermarketEntity = await service.update(supermarket.id, supermarket);
    expect(updatedSupermarket).not.toBeNull();

    const storedSupermarket: SupermarketEntity = await repository.findOne({ where: { id: supermarket.id } });
    expect(storedSupermarket).not.toBeNull();
    expect(storedSupermarket.name).toEqual(supermarket.name);
  });

  it('update should throw an exception for a name with less than 10 characters', async () => {
    let supermarket: SupermarketEntity = supermarketsList[0];
    supermarket = { ...supermarket, name: 'Short' };

    await expect(service.update(supermarket.id, supermarket)).rejects.toThrow(BadRequestException);
  });

  it('update should throw an exception for an invalid supermarket', async () => {
    const supermarket: SupermarketEntity = {
      id: 'invalid-id',
      name: 'Valid Names',
      latitud: faker.number.int({ min: 10, max: 100 }),
      longitud: faker.number.int({ min: 10, max: 100 }),
      website: faker.internet.url(),
      cities: [],
    };

    await expect(service.update(supermarket.id, supermarket)).rejects.toThrow(NotFoundException);
  });

  it('remove should delete a supermarket', async () => {
    const supermarket: SupermarketEntity = supermarketsList[0];
    await service.remove(supermarket.id);

    const deletedSupermarket: SupermarketEntity = await repository.findOne({ where: { id: supermarket.id } });
    expect(deletedSupermarket).toBeNull();
  });

  it('remove should throw an exception for an invalid supermarket', async () => {
    await expect(service.remove('invalid-id')).rejects.toThrow(NotFoundException);
  });
});
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CitiesSupermarketsService } from './cities-supermarkets.service';
import { CityEntity } from '../cities/entities/city.entity';
import { SupermarketEntity } from '../supermarkets/entities/supermarket.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/testing_utils/typeorm-testing-config';

describe('CitiesSupermarketsService', () => {
  let service: CitiesSupermarketsService;
  let cityRepository: Repository<CityEntity>;
  let supermarketRepository: Repository<SupermarketEntity>;
  let cityList: CityEntity[];
  let supermarketList: SupermarketEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [
        CitiesSupermarketsService
      ],
    }).compile();

    service = module.get<CitiesSupermarketsService>(CitiesSupermarketsService);
    cityRepository = module.get<Repository<CityEntity>>(getRepositoryToken(CityEntity));
    supermarketRepository = module.get<Repository<SupermarketEntity>>(getRepositoryToken(SupermarketEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    await cityRepository.clear();
    await supermarketRepository.clear();

    supermarketList = [];
    for (let i = 0; i < 5; i++) {
      const supermarket: SupermarketEntity = await supermarketRepository.save({
        latitud: faker.number.int({ min: 10, max: 100 }),
        longitud: faker.number.int({ min: 10, max: 100 }),
        name: faker.string.alphanumeric({ length: { min: 11, max: 15 } }),
        website: faker.internet.url(),
        cities: [],
      });
      supermarketList.push(supermarket);
    }

    cityList = [];
    for (let i = 0; i < 3; i++) {
      const city: CityEntity = await cityRepository.save({
        name: faker.location.city(),
        country: faker.location.country(),
        population: faker.number.int({ max: 1000 }),
        supermarkets: [...supermarketList],
      });
      cityList.push(city);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addSupermarketToCity should add a supermarket to a city', async () => {
    const city = cityList[0];
    const supermarket: SupermarketEntity = await supermarketRepository.save({
      latitud: faker.number.int({ min: 10, max: 100 }),
      longitud: faker.number.int({ min: 10, max: 100 }),
      name: faker.string.alphanumeric({ length: { min: 11, max: 15 } }),
      website: faker.internet.url(),
      cities: [],
    });

    const updatedCity = await service.addSupermarketToCity(city.id, supermarket.id);
    expect(updatedCity.supermarkets.length).toBeGreaterThan(0);
    expect(updatedCity.supermarkets.find(s => s.id === supermarket.id)).toBeDefined();
  });

  it('addSupermarketToCity should throw an exception for an invalid city', async () => {
    await expect(service.addSupermarketToCity('0', supermarketList[0].id)).rejects.toThrow(NotFoundException);
  });

  it('addSupermarketToCity should throw an exception for an invalid supermarket', async () => {
    await expect(service.addSupermarketToCity(cityList[0].id, '0')).rejects.toThrow(NotFoundException);
  });

  it('addSupermarketToCity should throw an exception if the supermarket is already associated', async () => {
    const city = cityList[0];
    const supermarket = city.supermarkets[0];

    await expect(service.addSupermarketToCity(city.id, supermarket.id)).rejects.toThrow(BadRequestException);
  });

  it('findSupermarketsFromCity should return supermarkets from a city', async () => {
    const city = cityList[0];
    const supermarkets = await service.findSupermarketsFromCity(city.id);

    expect(supermarkets).not.toBeNull();
    expect(supermarkets).toHaveLength(city.supermarkets.length);
  });

  it('findSupermarketsFromCity should throw an exception for an invalid city', async () => {
    await expect(service.findSupermarketsFromCity('0')).rejects.toThrow(NotFoundException);
  });

  it('findSupermarketFromCity should return a supermarket from a city', async () => {
    const city = cityList[0];
    const supermarket = city.supermarkets[0];
    const foundSupermarket = await service.findSupermarketFromCity(city.id, supermarket.id);

    expect(foundSupermarket).not.toBeNull();
    expect(foundSupermarket.id).toEqual(supermarket.id);
  });

  it('findSupermarketFromCity should throw an exception for an invalid city', async () => {
    await expect(service.findSupermarketFromCity('0', supermarketList[0].id)).rejects.toThrow(NotFoundException);
  });

  it('findSupermarketFromCity should throw an exception for an invalid supermarket', async () => {
    const city = cityList[0];
    await expect(service.findSupermarketFromCity(city.id, '0')).rejects.toThrow(NotFoundException);
  });

  it('updateSupermarketsFromCity should update supermarkets from a city', async () => {
    const city = cityList[0];
    const newSupermarkets = supermarketList.slice(0, 2);
    const updatedCity = await service.updateSupermarketsFromCity(city.id, newSupermarkets.map(s => s.id));

    expect(updatedCity.supermarkets.length).toEqual(newSupermarkets.length);
  });

  it('updateSupermarketsFromCity should throw an exception for an invalid city', async () => {
    await expect(service.updateSupermarketsFromCity('0', [supermarketList[0].id])).rejects.toThrow(NotFoundException);
  });

  it('updateSupermarketsFromCity should throw an exception for an invalid supermarket', async () => {
    await expect(service.updateSupermarketsFromCity(cityList[0].id, ['0'])).rejects.toThrow(NotFoundException);
  });

  it('deleteSupermarketFromCity should remove a supermarket from a city', async () => {
    const city = cityList[0];
    const supermarket = city.supermarkets[0];

    const updatedCity = await service.deleteSupermarketFromCity(city.id, supermarket.id);
    expect(updatedCity.supermarkets.find(s => s.id === supermarket.id)).toBeUndefined();
  });

  it('deleteSupermarketFromCity should throw an exception for an invalid city', async () => {
    await expect(service.deleteSupermarketFromCity('0', supermarketList[0].id)).rejects.toThrow(NotFoundException);
  });

  it('deleteSupermarketFromCity should throw an exception for an invalid supermarket', async () => {
    const city = cityList[0];
    await expect(service.deleteSupermarketFromCity(city.id, '0')).rejects.toThrow(NotFoundException);
  });
});
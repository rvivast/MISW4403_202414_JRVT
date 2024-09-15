import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CityEntity } from './entities/city.entity';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/testing_utils/typeorm-testing-config';

describe('CitiesService', () => {
  let service: CitiesService;
  let cityRepository: Repository<CityEntity>;
  let citiesList: CityEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [
        CitiesService
      ],
    }).compile();

    service = module.get<CitiesService>(CitiesService);
    cityRepository = module.get<Repository<CityEntity>>(getRepositoryToken(CityEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await cityRepository.clear();
    citiesList = [];
    for (let i = 0; i < 5; i++) {
      const city = await cityRepository.save({
        name: faker.location.city(),
        country: faker.location.country(),
        population: 1000,
        supermarkets: [],
      });
      citiesList.push(city);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all cities', async () => {
    const cities: CityEntity[] = await service.findAll();
    expect(cities).not.toBeNull();
    expect(cities).toHaveLength(citiesList.length);
  });

  it('findOne should return a city by id', async () => {
    const storedCity = citiesList[0];
    const city: CityEntity = await service.findOne(storedCity.id);
    expect(city).not.toBeNull();
    expect(city.name).toEqual(storedCity.name);
    expect(city.country).toEqual(storedCity.country);
  });

  it('findOne should throw an exception for an invalid city', async () => {
    await expect(service.findOne('0')).rejects.toThrow(NotFoundException);
  });

  it('create should return a new city', async () => {
    const city: CityEntity = {
      id: '',
      name: faker.location.city(),
      country: 'Argentina',
      population: 1000,
      supermarkets: [],
    };

    const newCity = await service.create(city);
    expect(newCity).not.toBeNull();

    const storedCity = await cityRepository.findOne({ where: { id: newCity.id } });
    expect(storedCity).not.toBeNull();
    expect(storedCity.name).toEqual(newCity.name);
  });

  it('create should throw an exception for an invalid country', async () => {
    const city: CityEntity = {
      id: '',
      name: faker.location.city(),
      country: 'InvalidCountry',
      population: 1000,
      supermarkets: [],
    };

    await expect(service.create(city)).rejects.toThrow(BadRequestException);
  });

  it('update should modify a city', async () => {
    const city = citiesList[0];
    city.name = 'Updated City';
    city.country = 'Ecuador';

    const updatedCity = await service.update(city.id, city);
    expect(updatedCity).not.toBeNull();

    const storedCity = await cityRepository.findOne({ where: { id: city.id } });
    expect(storedCity.name).toEqual(city.name);
    expect(storedCity.country).toEqual(city.country);
  });

  it('remove should delete a city', async () => {
    const city = citiesList[0];
    await service.remove(city.id);

    const deletedCity = await cityRepository.findOne({ where: { id: city.id } });
    expect(deletedCity).toBeNull();
  });

  it('remove should throw an exception for an invalid city', async () => {
    await expect(service.remove('0')).rejects.toThrow(NotFoundException);
  });
});
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { CityEntity } from './entities/city.entity';

@Injectable()
export class CitiesService {
  private readonly allowedCountries = ['Argentina', 'Ecuador', 'Paraguay'];

  constructor(
    @InjectRepository(CityEntity)
    private readonly cityRepository: Repository<CityEntity>,
  ) {}

  // Método para crear una nueva ciudad
  async create(createCityDto: CreateCityDto): Promise<CityEntity> {
    const { country } = createCityDto;

    // Validar que el país esté en la lista permitida
    if (!this.allowedCountries.includes(country)) {
      throw new BadRequestException(`El país ${country} no está permitido. Debe ser Argentina, Ecuador o Paraguay.`);
    }

    const newCity = this.cityRepository.create(createCityDto);
    return await this.cityRepository.save(newCity);
  }

  // Método para obtener todas las ciudades
  async findAll(): Promise<CityEntity[]> {
    return await this.cityRepository.find({ relations: ['supermarkets'] });
  }

  // Método para obtener una ciudad por su ID
  async findOne(id: string): Promise<CityEntity> {
    const city = await this.cityRepository.findOne({
      where: { id },
      relations: ['supermarkets'],
    });

    if (!city) {
      throw new NotFoundException(`La ciudad con ID ${id} no fue encontrada.`);
    }

    return city;
  }

  // Método para actualizar una ciudad existente
  async update(id: string, updateCityDto: UpdateCityDto): Promise<CityEntity> {
    const { country } = updateCityDto;

    // Validar que el país esté en la lista permitida
    if (country && !this.allowedCountries.includes(country)) {
      throw new BadRequestException(`El país ${country} no está permitido. Debe ser Argentina, Ecuador o Paraguay.`);
    }

    const city = await this.cityRepository.preload({
      id,
      ...updateCityDto,
    });

    if (!city) {
      throw new NotFoundException(`La ciudad con ID ${id} no fue encontrada.`);
    }

    return await this.cityRepository.save(city);
  }

  // Método para eliminar una ciudad
  async remove(id: string): Promise<void> {
    const city = await this.findOne(id);
    await this.cityRepository.remove(city);
  }
}
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CityEntity } from '../cities/entities/city.entity';
import { SupermarketEntity } from '../supermarkets/entities/supermarket.entity';

@Injectable()
export class CitiesSupermarketsService {
  constructor(
    @InjectRepository(CityEntity)
    private readonly cityRepository: Repository<CityEntity>,
    @InjectRepository(SupermarketEntity)
    private readonly supermarketRepository: Repository<SupermarketEntity>,
  ) {}

  // Método para asociar un supermercado a una ciudad
  async addSupermarketToCity(cityId: string, supermarketId: string): Promise<CityEntity> {
    const city = await this.cityRepository.findOne({
      where: { id: cityId },
      relations: ['supermarkets'],
    });
    if (!city) {
      throw new NotFoundException(`La ciudad con ID ${cityId} no fue encontrada.`);
    }

    const supermarket = await this.supermarketRepository.findOne({ where: { id: supermarketId } });
    if (!supermarket) {
      throw new NotFoundException(`El supermercado con ID ${supermarketId} no fue encontrado.`);
    }

    // Verificar si ya está asociado
    if (city.supermarkets.find((s) => s.id === supermarketId)) {
      throw new BadRequestException('El supermercado ya está asociado a esta ciudad.');
    }

    city.supermarkets.push(supermarket);
    return await this.cityRepository.save(city);
  }

  // Método para obtener los supermercados que tiene una ciudad
  async findSupermarketsFromCity(cityId: string): Promise<SupermarketEntity[]> {
    const city = await this.cityRepository.findOne({
      where: { id: cityId },
      relations: ['supermarkets'],
    });
    if (!city) {
      throw new NotFoundException(`La ciudad con ID ${cityId} no fue encontrada.`);
    }

    return city.supermarkets;
  }

  // Método para obtener un supermercado de una ciudad
  async findSupermarketFromCity(cityId: string, supermarketId: string): Promise<SupermarketEntity> {
    const city = await this.cityRepository.findOne({
      where: { id: cityId },
      relations: ['supermarkets'],
    });
    if (!city) {
      throw new NotFoundException(`La ciudad con ID ${cityId} no fue encontrada.`);
    }

    const supermarket = city.supermarkets.find((s) => s.id === supermarketId);
    if (!supermarket) {
      throw new NotFoundException(`El supermercado con ID ${supermarketId} no está asociado a la ciudad.`);
    }

    return supermarket;
  }

  // Método para actualizar los supermercados que tiene una ciudad
  async updateSupermarketsFromCity(cityId: string, supermarketIds: string[]): Promise<CityEntity> {
    const city = await this.cityRepository.findOne({
      where: { id: cityId },
      relations: ['supermarkets'],
    });
    if (!city) {
      throw new NotFoundException(`La ciudad con ID ${cityId} no fue encontrada.`);
    }

    const supermarkets = await this.supermarketRepository.findByIds(supermarketIds);
    if (supermarkets.length !== supermarketIds.length) {
      throw new NotFoundException('Uno o más supermercados no fueron encontrados.');
    }

    city.supermarkets = supermarkets;
    return await this.cityRepository.save(city);
  }

  // Método para eliminar el supermercado que tiene una ciudad
  async deleteSupermarketFromCity(cityId: string, supermarketId: string): Promise<CityEntity> {
    const city = await this.cityRepository.findOne({
      where: { id: cityId },
      relations: ['supermarkets'],
    });
    if (!city) {
      throw new NotFoundException(`La ciudad con ID ${cityId} no fue encontrada.`);
    }

    const supermarketIndex = city.supermarkets.findIndex((s) => s.id === supermarketId);
    if (supermarketIndex === -1) {
      throw new NotFoundException(`El supermercado con ID ${supermarketId} no está asociado a la ciudad.`);
    }

    city.supermarkets.splice(supermarketIndex, 1);
    return await this.cityRepository.save(city);
  }
}
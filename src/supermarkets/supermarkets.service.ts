import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateSupermarketDto } from './dto/create-supermarket.dto';
import { UpdateSupermarketDto } from './dto/update-supermarket.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupermarketEntity } from './entities/supermarket.entity';

@Injectable()
export class SupermarketsService {
  constructor(
    @InjectRepository(SupermarketEntity)
    private readonly supermarketRepository: Repository<SupermarketEntity>,
  ) {}

  // Método para crear un nuevo supermercado
  async create(createSupermarketDto: CreateSupermarketDto): Promise<SupermarketEntity> {
    const { name } = createSupermarketDto;

    // Validar que el nombre tenga más de 10 caracteres
    if (name.length <= 10) {
      throw new BadRequestException('El nombre del supermercado debe tener más de 10 caracteres.');
    }

    const newSupermarket = this.supermarketRepository.create(createSupermarketDto);
    return await this.supermarketRepository.save(newSupermarket);
  }

  // Método para obtener todos los supermercados
  async findAll(): Promise<SupermarketEntity[]> {
    return await this.supermarketRepository.find({ relations: ['cities'] });
  }

  // Método para obtener un supermercado por su ID
  async findOne(id: string): Promise<SupermarketEntity> {
    const supermarket = await this.supermarketRepository.findOne({
      where: { id },
      relations: ['cities'],
    });

    if (!supermarket) {
      throw new NotFoundException(`El supermercado con ID ${id} no fue encontrado.`);
    }

    return supermarket;
  }

  // Método para actualizar un supermercado existente
  async update(id: string, updateSupermarketDto: UpdateSupermarketDto): Promise<SupermarketEntity> {
    const { name } = updateSupermarketDto;

    // Validar que el nombre tenga más de 10 caracteres
    if (name && name.length <= 10) {
      throw new BadRequestException('El nombre del supermercado debe tener más de 10 caracteres.');
    }

    const supermarket = await this.supermarketRepository.preload({
      id,
      ...updateSupermarketDto,
    });

    if (!supermarket) {
      throw new NotFoundException(`El supermercado con ID ${id} no fue encontrado.`);
    }

    return await this.supermarketRepository.save(supermarket);
  }

  // Método para eliminar un supermercado
  async remove(id: string): Promise<void> {
    const supermarket = await this.findOne(id);
    await this.supermarketRepository.remove(supermarket);
  }
}
import { Controller, Get, Post, Patch, Param, Delete, Body, Put, HttpCode } from '@nestjs/common';
import { CitiesSupermarketsService } from './cities-supermarkets.service';

@Controller('cities/:cityId/supermarkets')
export class CitiesSupermarketsController {
  constructor(private readonly citiesSupermarketsService: CitiesSupermarketsService) {}

  // Asociar un supermercado a una ciudad
  @Post(':supermarketId')
  addSupermarketToCity(
    @Param('cityId') cityId: string,
    @Param('supermarketId') supermarketId: string,
  ) {
    return this.citiesSupermarketsService.addSupermarketToCity(cityId, supermarketId);
  }

  // Obtener todos los supermercados de una ciudad
  @Get()
  findSupermarketsFromCity(@Param('cityId') cityId: string) {
    return this.citiesSupermarketsService.findSupermarketsFromCity(cityId);
  }

  // Obtener un supermercado específico de una ciudad
  @Get(':supermarketId')
  findSupermarketFromCity(
    @Param('cityId') cityId: string,
    @Param('supermarketId') supermarketId: string,
  ) {
    return this.citiesSupermarketsService.findSupermarketFromCity(cityId, supermarketId);
  }

  // Actualizar los supermercados asociados a una ciudad
  @Put()
  updateSupermarketsFromCity(
    @Param('cityId') cityId: string,
    @Body('supermarketIds') supermarketIds: string[],
  ) {
    return this.citiesSupermarketsService.updateSupermarketsFromCity(cityId, supermarketIds);
  }

  // Eliminar un supermercado específico de una ciudad
  @Delete(':supermarketId')
  @HttpCode(204)
  deleteSupermarketFromCity(
    @Param('cityId') cityId: string,
    @Param('supermarketId') supermarketId: string,
  ) {
    return this.citiesSupermarketsService.deleteSupermarketFromCity(cityId, supermarketId);
  }
}
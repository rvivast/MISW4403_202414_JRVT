import { PartialType } from '@nestjs/mapped-types';
import { CreateCitiesSupermarketDto } from './create-cities-supermarket.dto';

export class UpdateCitiesSupermarketDto extends PartialType(CreateCitiesSupermarketDto) {}

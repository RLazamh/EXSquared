import { IsString, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class VehicleTypeDto {
  @IsString()
  typeId: string;

  @IsString()
  typeName: string;
}

export class VehicleDto {
  @IsString()
  makeId: string;

  @IsString()
  makeName: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VehicleTypeDto)
  @IsOptional()
  vehicleTypes?: VehicleTypeDto[];
}

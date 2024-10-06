import { IsString, IsArray, ValidateNested } from 'class-validator';
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
  vehicleTypes: VehicleTypeDto[];
}

import { IsString } from 'class-validator';

export class VehicleMakeDtoResponse {
  @IsString()
  makeId: string;

  @IsString()
  makeName: string;
}

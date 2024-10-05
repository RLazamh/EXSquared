import { Injectable } from '@nestjs/common';
import { VehicleDomService } from '../../domain/vehicle/vehicle-dom.service';
import { VehicleMakeDtoResponse } from './dtos/vehicle.dto';

@Injectable()
export class ProcessVehicleXmlUseCase {
  constructor(private readonly _vehicleDomService: VehicleDomService) {}

  async execute(): Promise<VehicleMakeDtoResponse[]> {
    return await this._vehicleDomService.getTransformedVehicleData();
  }
}

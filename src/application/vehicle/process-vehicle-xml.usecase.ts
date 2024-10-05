import { Injectable } from '@nestjs/common';
import { VehicleDomService } from '../../domain/vehicle/vehicle-dom.service';

@Injectable()
export class ProcessVehicleXmlUseCase {
  constructor(private readonly _vehicleDomService: VehicleDomService) {}

  async execute(): Promise<any> {
    return await this._vehicleDomService.getTransformedVehicleData();
  }
}

import { Controller, Get } from '@nestjs/common';
import { VehicleService } from '../../domain/vehicle/vehicle.service';

@Controller('vehicle')
export class VehicleController {
  constructor(private readonly _vehicleService: VehicleService) {}

  @Get('fetch-xml')
  async fetchVehicleXml() {
    const xmlData = await this._vehicleService.getTransformedVehicleData();
    return xmlData;
  }
}

import { Controller, Get } from '@nestjs/common';
import { VehicleDomService } from 'src/domain/vehicle/vehicle-dom.service';

@Controller('vehicle')
export class VehicleController {
  constructor(private readonly _vehicleDomService: VehicleDomService) {}

  @Get('fetch-xml')
  async fetchVehicleXml() {
    const xmlData = await this._vehicleDomService.getTransformedVehicleData();
    return xmlData;
  }
}

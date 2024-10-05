import { Controller, Get } from '@nestjs/common';
import { ProcessVehicleXmlUseCase } from '../../application/vehicle/process-vehicle-xml.usecase';

@Controller('vehicle')
export class VehicleController {
  constructor(
    private readonly _processVehicleXmlUseCase: ProcessVehicleXmlUseCase,
  ) {}

  @Get('fetch-xml')
  async fetchVehicleXml() {
    const xmlData = await this._processVehicleXmlUseCase.execute();
    return xmlData;
  }
}

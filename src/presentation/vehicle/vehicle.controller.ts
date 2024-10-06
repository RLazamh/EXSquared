import { Controller, Get, Query } from '@nestjs/common';
import { CrudVehicleUseCase } from '../../application/vehicle/crud-vehicle.usecase';
import { ProcessVehicleDataUseCase } from '../../application/vehicle/process-vehicle-data.usecase';

@Controller('vehicle')
export class VehicleController {
  constructor(
    private readonly _processVehicleDataUseCase: ProcessVehicleDataUseCase,
    private readonly _crudVehicleUseCase: CrudVehicleUseCase,
  ) {}

  @Get('fetch-xml')
  async fetchVehicleXml() {
    const xmlData = await this._processVehicleDataUseCase.execute();
    return xmlData;
  }

  @Get('fetch-data')
  async fetchVehicleData(
    @Query('limit') limit = 100,
    @Query('page') page = 1,
  ): Promise<any[]> {
    console.log('Fetching vehicle data from DB');
    return this._crudVehicleUseCase.getVehicles(limit, page); // Llama al servicio para obtener datos
  }
}

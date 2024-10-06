import { Controller, Get, Headers, Logger, Post, Query } from '@nestjs/common';
import { CrudVehicleUseCase } from '../../application/vehicle/crud-vehicle.usecase';
import { ProcessVehicleDataUseCase } from '../../application/vehicle/process-vehicle-data.usecase';

@Controller('vehicle')
export class VehicleController {
  private readonly logger: Logger;
  constructor(
    private readonly _processVehicleDataUseCase: ProcessVehicleDataUseCase,
    private readonly _crudVehicleUseCase: CrudVehicleUseCase,
  ) {
    this.logger = new Logger(VehicleController.name);
  }

  @Post('proccess-xml')
  async proccessVehicleXml(@Headers('trackingId') trackingId: string) {
    this.logger.log(`Processing async task with Tracking ID: ${trackingId}`);
    const xmlData = await this._processVehicleDataUseCase.execute(trackingId);
    return xmlData;
  }

  @Get('fetch-data')
  async fetchVehicleData(
    @Query('limit') limit = 100,
    @Query('page') page = 1,
    @Headers('trackingId') trackingId: string,
  ): Promise<any[]> {
    this.logger.log(`Processing request with Tracking ID: ${trackingId}`);
    return this._crudVehicleUseCase.getVehicles(limit, page);
  }
}

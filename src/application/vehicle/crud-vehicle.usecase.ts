import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { VehicleDBService } from '../../infrastructure/db/services/vehicle/vehicle-db.service';
import { VehicleDto } from './dtos/vehicle.dto';
import { VEHICLE } from '../common/events';

@Injectable()
export class CrudVehicleUseCase {
  private readonly logger = new Logger(CrudVehicleUseCase.name);

  constructor(private readonly _vehicleDBService: VehicleDBService) {}

  @OnEvent(VEHICLE.SAVE_OR_UPDATE, { async: true })
  async handleSaveOrUpdateEvent(vehicles: Partial<any[]>): Promise<void> {
    this.logger.log(
      `Listener triggered: Processing ${vehicles.length} vehicles for save/update in DB.`,
    );

    try {
      await this._vehicleDBService.saveOrUpdateVehicles(vehicles);
      this.logger.log(`Successfully processed ${vehicles.length} vehicles.`);
    } catch (error) {
      this.logger.error(
        `Failed to process vehicles for save/update. Error: ${error.message}`,
        error.stack,
      );
    }
  }

  async getVehicles(limit: number, page: number): Promise<VehicleDto[]> {
    this.logger.log(`Fetching vehicles with limit: ${limit}, page: ${page}.`);

    try {
      const vehicles = await this._vehicleDBService.getVehicles(limit, page);
      this.logger.log(`Successfully fetched ${vehicles.length} vehicles.`);
      return vehicles;
    } catch (error) {
      this.logger.error(
        `Failed to fetch vehicles. Error: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}

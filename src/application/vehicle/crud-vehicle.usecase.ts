import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { VehicleDBService } from '../../infrastructure/db/services/vehicle/vehicle-db.service';
import { VEHICLE } from '../events/common';
import { VehicleDto } from './dtos/vehicle.dto';

@Injectable()
export class CrudVehicleUseCase {
  constructor(private readonly _vehicleDBService: VehicleDBService) {}

  @OnEvent(VEHICLE.SAVE_OR_UPDATE, { async: true })
  async handleSaveOrUpdateEvent(vehicles: Partial<any[]>): Promise<void> {
    console.log('Listener: vehicle proccess for save/update on DB');
    await this._vehicleDBService.saveOrUpdateVehicles(vehicles);
  }

  async getVehicles(limit: number, page: number): Promise<VehicleDto[]> {
    return await this._vehicleDBService.getVehicles(limit, page);
  }
}

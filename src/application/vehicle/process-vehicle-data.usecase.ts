import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import Bottleneck from 'bottleneck';
import { VehicleDomService } from '../../domain/vehicle/vehicle-dom.service';
import { VehicleDBService } from '../../infrastructure/db/services/vehicle/vehicle-db.service'; // Ajusta la ruta según tu estructura
import { VEHICLE } from '../events/common';

@Injectable()
export class ProcessVehicleDataUseCase {
  private readonly logger = new Logger(ProcessVehicleDataUseCase.name);

  constructor(
    private readonly _vehicleDomService: VehicleDomService,
    private readonly _eventEmitter: EventEmitter2,
    private readonly _vehicleDBService: VehicleDBService,
  ) {}

  async execute(): Promise<void> {
    const limiter = new Bottleneck({
      maxConcurrent: 200,
      minTime: 300,
    });

    const vehicles = await this._vehicleDomService.getVehicleMakeData();
    const batchSize = 100;
    const batch: any[] = [];

    for (const vehicle of vehicles) {
      if (!vehicle || !vehicle.Make_ID || !vehicle.Make_Name) {
        continue;
      }

      const transformedVehicle = await limiter.schedule(async () => {
        const moreInfo = await this._vehicleDomService.getVehicleMakeByIdData(
          vehicle.Make_ID,
        );

        const vehicleTypesForMakeIds = Array.isArray(moreInfo)
          ? moreInfo
          : [moreInfo];

        const vehicleTypes = vehicleTypesForMakeIds.map((type) => ({
          typeId: type.VehicleTypeId?.trim(),
          typeName: type.VehicleTypeName?.trim(),
        }));

        return {
          makeId: vehicle.Make_ID.trim(),
          makeName: vehicle.Make_Name.trim(),
          vehicleTypes,
        };
      });

      if (transformedVehicle) {
        batch.push(transformedVehicle);
      }

      if (batch.length >= batchSize) {
        this._eventEmitter.emit(VEHICLE.SAVE_OR_UPDATE, batch);
        await this._vehicleDBService.saveOrUpdateVehicles(batch);
        batch.length = 0;
      }
    }

    if (batch.length > 0) {
      this._eventEmitter.emit(VEHICLE.SAVE_OR_UPDATE, batch);
      await this._vehicleDBService.saveOrUpdateVehicles(batch);
    }

    this.logger.log('proccess end up with successful.');
  }
}

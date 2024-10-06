import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import Bottleneck from 'bottleneck';
import { VehicleDomService } from '../../domain/vehicle/vehicle-dom.service';
import { VEHICLE } from '../common/events';
import { ENVIRONMENT } from '../common/enviroment';
import { VehicleDto } from './dtos/vehicle.dto';

@Injectable()
export class ProcessVehicleDataUseCase {
  private readonly logger = new Logger(ProcessVehicleDataUseCase.name);

  constructor(
    private readonly _vehicleDomService: VehicleDomService,
    private readonly _eventEmitter: EventEmitter2,
  ) {}

  public async execute(trackingId: string): Promise<void> {
    this.logger.log(
      `Loaded BOTTLENECK_MAX_CONCURRENT: ${ENVIRONMENT.bottleneckMaxConcurrent}, BOTTLENECK_MIN_TIME: ${ENVIRONMENT.bottleneckMinTime}`,
    );

    const limiter = new Bottleneck({
      maxConcurrent: ENVIRONMENT.bottleneckMaxConcurrent,
      minTime: ENVIRONMENT.bottleneckMinTime,
    });
    const batch: VehicleDto[] = [];
    const batchSize = ENVIRONMENT.batchSizeProcessing;

    try {
      const vehicles = await this._vehicleDomService.getVehicleMakeData();

      for (const vehicle of vehicles) {
        if (!vehicle || !vehicle.Make_ID || !vehicle.Make_Name) {
          this.logger.warn(
            `Invalid vehicle data: ${JSON.stringify(
              vehicle,
            )} - Tracking ID: ${trackingId}`,
          );
          continue;
        }

        const transformedVehicle = await this.transformVehicle(
          vehicle,
          limiter,
        );

        if (transformedVehicle) batch.push(transformedVehicle);

        if (batch.length >= batchSize) {
          await this.saveBatch(batch, trackingId);
          batch.length = 0;
        }
      }

      if (batch.length > 0) await this.saveBatch(batch, trackingId);

      this.logger.log(
        `Process completed successfully - Tracking ID: ${trackingId}`,
      );
    } catch (error) {
      this.logger.error(
        `Error processing vehicles - Tracking ID: ${trackingId}`,
        error.stack,
      );
      throw error;
    }
  }

  private async transformVehicle(
    vehicle: any,
    limiter: Bottleneck,
  ): Promise<VehicleDto> {
    const moreInfo = await limiter.schedule(() =>
      this._vehicleDomService.getVehicleMakeByIdData(vehicle.Make_ID),
    );

    const vehicleTypes = (Array.isArray(moreInfo) ? moreInfo : [moreInfo]).map(
      (type) => ({
        typeId: type.VehicleTypeId?.trim(),
        typeName: type.VehicleTypeName?.trim(),
      }),
    );

    return {
      makeId: vehicle.Make_ID.trim(),
      makeName: vehicle.Make_Name.trim(),
      vehicleTypes,
    };
  }

  private async saveBatch(batch: VehicleDto[], trackingId: string) {
    this.logger.log(
      `Saving batch with size: ${batch.length} - Tracking ID: ${trackingId}`,
    );
    this._eventEmitter.emit(VEHICLE.SAVE_OR_UPDATE, [...batch]);
  }
}

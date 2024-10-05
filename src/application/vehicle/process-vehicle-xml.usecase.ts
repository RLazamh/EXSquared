import { Injectable } from '@nestjs/common';
import { VehicleDomService } from '../../domain/vehicle/vehicle-dom.service';
import Bottleneck from 'bottleneck';

@Injectable()
export class ProcessVehicleXmlUseCase {
  constructor(private readonly _vehicleDomService: VehicleDomService) {}

  async execute(): Promise<any[]> {
    const limiter = new Bottleneck({
      maxConcurrent: 30,
      minTime: 50,
    });

    const vehicles = await this._vehicleDomService.getVehicleMakeData();
    const results = [];

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
        results.push(transformedVehicle);
      }
    }

    return results;
  }
}

import { Injectable } from '@nestjs/common';
import { VehicleMakesProvider } from '../../providers/apis/vehicle-makes.providers';
import { VehicleMakeIdProvider } from '../../providers/apis/vehicle-make-id.providers';

@Injectable()
export class VehicleDomService {
  constructor(
    private readonly _vehicleMakesProvider: VehicleMakesProvider,
    private readonly _vehicleMakeIdProvider: VehicleMakeIdProvider,
  ) {}

  async getVehicleMakeData(): Promise<any[]> {
    const vehicles = await this._vehicleMakesProvider.getAllMakesJSON();
    return vehicles;
  }

  async getVehicleMakeByIdData(vehicleId: string): Promise<any> {
    const vehicles = await this._vehicleMakeIdProvider.getMakeByIdJSON(
      vehicleId,
    );
    return vehicles;
  }
}

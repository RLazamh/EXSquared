import { Injectable } from '@nestjs/common';
import { VehicleApiProvider } from '../../providers/apis/vehicle-api.providers';

@Injectable()
export class VehicleDomService {
  constructor(private readonly _vehicleApiProvider: VehicleApiProvider) {}

  async getTransformedVehicleData(): Promise<any[]> {
    const vehicle = await this._vehicleApiProvider.getVehicleJSON();

    const validMakes = vehicle.filter((data: any) => {
      if (!data.Make_ID || !data.Make_Name) {
        console.warn(`Data no valid: ${JSON.stringify(data)}`);
        return false;
      }
      return true;
    });

    return validMakes.map((vehicle) => ({
      makeId: vehicle.Make_ID.trim(),
      makeName: vehicle.Make_Name.trim(),
    }));
  }
}

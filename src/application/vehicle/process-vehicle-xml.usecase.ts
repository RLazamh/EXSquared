import { Injectable } from '@nestjs/common';
import { VehicleDomService } from '../../domain/vehicle/vehicle-dom.service';

@Injectable()
export class ProcessVehicleXmlUseCase {
  constructor(private readonly _vehicleDomService: VehicleDomService) {}

  async execute(): Promise<any[]> {
    const vehicles = await this._vehicleDomService.getVehicleMakeData();
    const moreInfo = await this._vehicleDomService.getVehicleMakeByIdData(
      vehicles[0].Make_ID,
    );

    const transformedData = [
      {
        makeId: vehicles[0].Make_ID.trim(),
        makeName: vehicles[0].Make_Name.trim(),
        vehicleTypes: [
          {
            typeId: moreInfo.VehicleTypeId.trim(),
            typeName: moreInfo.VehicleTypeName.trim(),
          },
        ],
      },
    ];

    // Retornar los datos transformados
    return transformedData;
  }
}

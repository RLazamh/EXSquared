import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { parseStringPromise } from 'xml2js';

@Injectable()
export class VehicleApiProvider {
  constructor(private readonly httpService: HttpService) {}

  async getVehicleXML(): Promise<string> {
    const response = await firstValueFrom(
      this.httpService.get(
        'https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=XML',
      ),
    );
    return response.data;
  }

  async getVehicleJSON(): Promise<any> {
    const xmlData = await this.getVehicleXML();
    const jsonData = await parseStringPromise(xmlData, {
      explicitArray: false,
      mergeAttrs: true,
    });

    const vehicleMakes = jsonData.Response?.Results?.AllVehicleMakes || [];
    return vehicleMakes;
  }
}

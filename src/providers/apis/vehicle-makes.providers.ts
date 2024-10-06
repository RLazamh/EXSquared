import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { parseStringPromise } from 'xml2js';
import { ENDPOINTS } from './endpoint';

@Injectable()
export class VehicleMakesProvider {
  BASE_URL_VEHICLE_PROVIDER = process.env.BASE_URL_VEHICLE_PROVIDER;

  constructor(private readonly _httpService: HttpService) {}

  async getAllMakesXML(): Promise<string> {
    const response = await firstValueFrom(
      this._httpService.get(
        `${this.BASE_URL_VEHICLE_PROVIDER}${ENDPOINTS.getAllMakesXML}`,
      ),
    );
    return response.data;
  }

  async getAllMakesJSON(): Promise<any[]> {
    const xmlData = await this.getAllMakesXML();
    const jsonData = await parseStringPromise(xmlData, {
      explicitArray: false,
      mergeAttrs: true,
    });

    const vehicleMakes = jsonData.Response?.Results?.AllVehicleMakes || [];
    return vehicleMakes;
  }
}

import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { parseStringPromise } from 'xml2js';
import { ENDPOINTS } from './endpoint';

@Injectable()
export class VehicleMakeIdProvider {
  BASE_URL_VEHICLE_PROVIDER = process.env.BASE_URL_VEHICLE_PROVIDER;

  constructor(private readonly _httpService: HttpService) {}

  async getMakeByIdXML(makeId: string): Promise<string> {
    const response = await firstValueFrom(
      this._httpService.get(
        `${this.BASE_URL_VEHICLE_PROVIDER}${ENDPOINTS.getMakeByIdXML(makeId)}`,
      ),
    );
    return response.data;
  }

  async getMakeByIdJSON(makeId: string): Promise<any> {
    const xmlData = await this.getMakeByIdXML(makeId);
    const jsonData = await parseStringPromise(xmlData, {
      explicitArray: false,
      mergeAttrs: true,
    });
    const vehicleMakes =
      jsonData.Response?.Results?.VehicleTypesForMakeIds || [];
    return vehicleMakes;
  }
}

import { Injectable } from '@nestjs/common';
import { parseStringPromise } from 'xml2js';
import { VehicleXmlProvider } from '../../providers/xml/vehicle-xml.providers';

@Injectable()
export class VehicleService {
  constructor(private readonly _vehicleXmlProvider: VehicleXmlProvider) {}

  async getTransformedVehicleData(): Promise<any> {
    const xmlData = await this._vehicleXmlProvider.getVehicleData();
    const jsonData = await parseStringPromise(xmlData, {
      explicitArray: false,
      mergeAttrs: true,
    });
    return jsonData;
  }
}

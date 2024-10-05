import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class VehicleXmlProvider {
  constructor(private readonly httpService: HttpService) {}

  async getVehicleData(): Promise<any> {
    const response = await firstValueFrom(
      this.httpService.get(
        'https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=XML',
      ),
    );
    return response.data;
  }
}

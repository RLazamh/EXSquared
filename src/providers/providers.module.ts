import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { VehicleApiProvider } from './apis/vehicle-api.providers';

@Module({
  imports: [HttpModule],
  providers: [VehicleApiProvider],
  exports: [VehicleApiProvider],
})
export class ProvidersModule {}

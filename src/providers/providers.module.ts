import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { VehicleMakesProvider } from './apis/vehicle-makes.providers';
import { VehicleMakeIdProvider } from './apis/vehicle-make-id.providers';

@Module({
  imports: [HttpModule],
  providers: [VehicleMakesProvider, VehicleMakeIdProvider],
  exports: [VehicleMakesProvider, VehicleMakeIdProvider],
})
export class ProvidersModule {}

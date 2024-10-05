import { Module } from '@nestjs/common';
import { ProcessVehicleXmlUseCase } from '../../application/vehicle/process-vehicle-xml.usecase';
import { VehicleDomService } from '../../domain/vehicle/vehicle-dom.service';
import { ProvidersModule } from '../../providers/providers.module';
import { VehicleController } from './vehicle.controller';

@Module({
  imports: [ProvidersModule],
  controllers: [VehicleController],
  providers: [ProcessVehicleXmlUseCase, VehicleDomService],
})
export class VehicleModule {}

import { Module } from '@nestjs/common';
import { ProcessVehicleDataUseCase } from '../../application/vehicle/process-vehicle-data.usecase';
import { VehicleDomService } from '../../domain/vehicle/vehicle-dom.service';
import { ProvidersModule } from '../../providers/providers.module';
import { CrudVehicleUseCase } from '../../application/vehicle/crud-vehicle.usecase';
import { VehicleController } from './vehicle.controller';
import { DbModule } from '../../infrastructure/db/db.module';

@Module({
  imports: [ProvidersModule, DbModule],
  controllers: [VehicleController],
  providers: [ProcessVehicleDataUseCase, VehicleDomService, CrudVehicleUseCase],
})
export class VehicleModule {}

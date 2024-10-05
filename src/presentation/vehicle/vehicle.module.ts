import { Module } from '@nestjs/common';
import { VehicleService } from '../../domain/vehicle/vehicle.service';
import { VehicleController } from './vehicle.controller';
import { ProvidersModule } from '../../providers/providers.module';

@Module({
  imports: [ProvidersModule],
  controllers: [VehicleController],
  providers: [VehicleService],
})
export class VehicleModule {}

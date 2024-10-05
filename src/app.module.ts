import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { VehicleController } from './application/vehicle/vehicle.controller';
import { VehicleService } from './domain/vehicle/vehicle.service';
import { ProvidersModule } from './providers/providers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'dev.env',
    }),
    ProvidersModule,
  ],
  controllers: [VehicleController],
  providers: [VehicleService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { VehicleModule } from './presentation/vehicle/vehicle.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'dev.env',
    }),
    VehicleModule,
  ],
})
export class AppModule {}

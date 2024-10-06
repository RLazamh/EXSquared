import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from './infrastructure/db/db.module';
import { VehicleModule } from './presentation/vehicle/vehicle.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    VehicleModule,
    DbModule,
  ],
})
export class AppModule {}

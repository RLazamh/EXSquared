import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { getMongoConfig } from './config/db.config';
import { VehicleDBService } from './services/vehicle/vehicle-db.service';
import { Vehicle, VehicleSchema } from './entities/vehicle/vehicle.entity';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        getMongoConfig(configService),
    }),
    MongooseModule.forFeature([{ name: Vehicle.name, schema: VehicleSchema }]),
  ],
  exports: [VehicleDBService],
  providers: [VehicleDBService],
})
export class DbModule {}

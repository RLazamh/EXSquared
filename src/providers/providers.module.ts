import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { VehicleXmlProvider } from './xml/vehicle-xml.providers';

@Module({
  imports: [HttpModule],
  providers: [VehicleXmlProvider],
  exports: [VehicleXmlProvider],
})
export class ProvidersModule {}

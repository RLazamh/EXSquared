import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vehicle } from '../../entities/vehicle/vehicle.entity';

@Injectable()
export class VehicleDBService {
  constructor(
    @InjectModel(Vehicle.name)
    private readonly vehicleModel: Model<Vehicle>,
  ) {}

  async getVehicles(limit: number, page: number): Promise<Vehicle[]> {
    const skip = (page - 1) * limit;
    return this.vehicleModel
      .find()
      .skip(skip)
      .limit(limit)
      .select('-_id -__v')
      .exec();
  }

  async saveOrUpdateVehicles(vehicles: Partial<Vehicle[]>): Promise<void> {
    const bulkOps = vehicles.map((vehicle) => ({
      updateOne: {
        filter: { makeId: vehicle.makeId },
        update: { $set: vehicle },
        upsert: true,
      },
    }));

    await this.vehicleModel.bulkWrite(bulkOps);
  }
}

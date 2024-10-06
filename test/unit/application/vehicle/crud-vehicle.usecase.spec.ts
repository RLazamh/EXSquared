import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { CrudVehicleUseCase } from '../../../../src/application/vehicle/crud-vehicle.usecase';
import { VehicleDBService } from '../../../../src/infrastructure/db/services/vehicle/vehicle-db.service';

describe('CrudVehicleUseCase (unit test)', () => {
  let useCase: CrudVehicleUseCase;
  let vehicleDBService: VehicleDBService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CrudVehicleUseCase,
        {
          provide: VehicleDBService,
          useValue: {
            saveOrUpdateVehicles: jest.fn(),
            getVehicles: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<CrudVehicleUseCase>(CrudVehicleUseCase);
    vehicleDBService = module.get<VehicleDBService>(VehicleDBService);
    jest.spyOn(Logger.prototype, 'log').mockImplementation();
    jest.spyOn(Logger.prototype, 'error').mockImplementation();
  });

  it('GIVEN a save or update event WHEN handleSaveOrUpdateEvent is called THEN it should save or update vehicles', async () => {
    // GIVEN
    const vehicles = [{ id: 1, make: 'Toyota' }];
    (vehicleDBService.saveOrUpdateVehicles as jest.Mock).mockResolvedValue(
      undefined,
    );

    // WHEN
    await useCase.handleSaveOrUpdateEvent(vehicles);

    // THEN
    expect(vehicleDBService.saveOrUpdateVehicles).toHaveBeenCalledWith(
      vehicles,
    );
    expect(Logger.prototype.log).toHaveBeenCalledWith(
      'Successfully processed 1 vehicles.',
    );
  });

  it('GIVEN a request to fetch vehicles WHEN getVehicles is called THEN it should return the list of vehicles', async () => {
    // GIVEN
    const vehicles = [{ id: 1, make: 'Toyota', model: 'Corolla' }];
    (vehicleDBService.getVehicles as jest.Mock).mockResolvedValue(vehicles);

    // WHEN
    const result = await useCase.getVehicles(10, 1);

    // THEN
    expect(vehicleDBService.getVehicles).toHaveBeenCalledWith(10, 1);
    expect(result).toEqual(vehicles);
    expect(Logger.prototype.log).toHaveBeenCalledWith(
      'Successfully fetched 1 vehicles.',
    );
  });
});

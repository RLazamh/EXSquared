import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { VehicleController } from '../../../../src/presentation/vehicle/vehicle.controller';
import { ProcessVehicleDataUseCase } from '../../../../src/application/vehicle/process-vehicle-data.usecase';
import { CrudVehicleUseCase } from '../../../../src/application/vehicle/crud-vehicle.usecase';

describe('VehicleController (unit test)', () => {
  let controller: VehicleController;
  let processVehicleDataUseCase: ProcessVehicleDataUseCase;
  let crudVehicleUseCase: CrudVehicleUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehicleController],
      providers: [
        {
          provide: ProcessVehicleDataUseCase,
          useValue: {
            execute: jest.fn(), // Mockear el método execute
          },
        },
        {
          provide: CrudVehicleUseCase,
          useValue: {
            getVehicles: jest.fn(), // Mockear el método getVehicles
          },
        },
      ],
    }).compile();

    controller = module.get<VehicleController>(VehicleController);
    processVehicleDataUseCase = module.get<ProcessVehicleDataUseCase>(
      ProcessVehicleDataUseCase,
    );
    crudVehicleUseCase = module.get<CrudVehicleUseCase>(CrudVehicleUseCase);

    jest.spyOn(Logger.prototype, 'log').mockImplementation();
  });

  it('GIVEN a request to POST /vehicle/proccess-xml WHEN the controller is called THEN it should process vehicle data', async () => {
    const trackingId = 'tracking-id-123';
    (processVehicleDataUseCase.execute as jest.Mock).mockResolvedValue(
      'xmlDataProcessed',
    );

    const result = await controller.proccessVehicleXml(trackingId);

    expect(processVehicleDataUseCase.execute).toHaveBeenCalledWith(trackingId);
    expect(result).toBe('xmlDataProcessed');
    expect(Logger.prototype.log).toHaveBeenCalledWith(
      `Processing async task with Tracking ID: ${trackingId}`,
    );
  });

  it('GIVEN a request to GET /vehicle/fetch-data WHEN the controller is called THEN it should fetch vehicle data', async () => {
    const vehicles = [{ makeId: '1', makeName: 'Toyota' }];
    const limit = 100;
    const page = 1;
    const trackingId = 'tracking-id-123';
    (crudVehicleUseCase.getVehicles as jest.Mock).mockResolvedValue(vehicles);

    const result = await controller.fetchVehicleData(limit, page, trackingId);

    expect(crudVehicleUseCase.getVehicles).toHaveBeenCalledWith(limit, page);
    expect(result).toBe(vehicles);
    expect(Logger.prototype.log).toHaveBeenCalledWith(
      `Processing request with Tracking ID: ${trackingId}`,
    );
  });
});

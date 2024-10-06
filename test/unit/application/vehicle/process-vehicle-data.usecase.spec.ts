import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Logger } from '@nestjs/common';
import { ProcessVehicleDataUseCase } from '../../../../src/application/vehicle/process-vehicle-data.usecase';
import { VehicleDomService } from '../../../../src/domain/vehicle/vehicle-dom.service';
import { ENVIRONMENT } from '../../../../src/application/common/enviroment';

jest.mock('bottleneck');

describe('ProcessVehicleDataUseCase (unit test)', () => {
  let useCase: ProcessVehicleDataUseCase;
  let vehicleDomService: VehicleDomService;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProcessVehicleDataUseCase,
        {
          provide: VehicleDomService,
          useValue: {
            getVehicleMakeData: jest.fn(),
            getVehicleMakeByIdData: jest.fn(),
          },
        },
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<ProcessVehicleDataUseCase>(ProcessVehicleDataUseCase);
    vehicleDomService = module.get<VehicleDomService>(VehicleDomService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);

    jest.spyOn(Logger.prototype, 'log').mockImplementation();
    jest.spyOn(Logger.prototype, 'error').mockImplementation();
  });

  it('GIVEN a set of vehicles WHEN execute is called THEN vehicles are processed and saved in batches', async () => {
    const vehicles = [{ Make_ID: '1', Make_Name: 'Toyota' }];
    ENVIRONMENT.bottleneckMaxConcurrent = 5;
    ENVIRONMENT.bottleneckMinTime = 200;
    ENVIRONMENT.batchSizeProcessing = 1;

    (vehicleDomService.getVehicleMakeData as jest.Mock).mockResolvedValue(
      vehicles,
    );
    (vehicleDomService.getVehicleMakeByIdData as jest.Mock).mockResolvedValue(
      [],
    );

    await useCase.execute('tracking-id-123');

    expect(vehicleDomService.getVehicleMakeData).toHaveBeenCalled();
    expect(Logger.prototype.log).toHaveBeenCalledWith(
      'Process completed successfully - Tracking ID: tracking-id-123',
    );
  });
});

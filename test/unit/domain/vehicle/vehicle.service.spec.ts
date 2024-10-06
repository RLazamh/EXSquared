import { Test, TestingModule } from '@nestjs/testing';
import { VehicleDomService } from '../../../../src/domain/vehicle/vehicle-dom.service';
import { VehicleMakesProvider } from '../../../../src/providers/apis/vehicle-makes.providers';
import { VehicleMakeIdProvider } from '../../../../src/providers/apis/vehicle-make-id.providers';

describe('VehicleDomService (unit test)', () => {
  let vehicleDomService: VehicleDomService;
  let vehicleMakesProvider: VehicleMakesProvider;
  let vehicleMakeIdProvider: VehicleMakeIdProvider;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        VehicleDomService,
        {
          provide: VehicleMakesProvider,
          useFactory: () => ({
            getAllMakesJSON: jest.fn(),
          }),
        },
        {
          provide: VehicleMakeIdProvider,
          useFactory: () => ({
            getMakeByIdJSON: jest.fn(),
          }),
        },
      ],
    }).compile();

    vehicleDomService = moduleFixture.get<VehicleDomService>(VehicleDomService);
    vehicleMakesProvider =
      moduleFixture.get<VehicleMakesProvider>(VehicleMakesProvider);
    vehicleMakeIdProvider = moduleFixture.get<VehicleMakeIdProvider>(
      VehicleMakeIdProvider,
    );
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(vehicleDomService).toBeDefined();
    expect(vehicleMakesProvider).toBeDefined();
    expect(vehicleMakeIdProvider).toBeDefined();
  });

  describe('getVehicleMakeData', () => {
    it('should call getAllMakesJSON from VehicleMakesProvider and return data', async () => {
      const mockVehicleData = [{ make: 'Toyota' }];
      (vehicleMakesProvider.getAllMakesJSON as jest.Mock).mockResolvedValue(
        mockVehicleData,
      );

      const result = await vehicleDomService.getVehicleMakeData();

      expect(vehicleMakesProvider.getAllMakesJSON).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockVehicleData);
    });
  });

  describe('getVehicleMakeByIdData', () => {
    it('should call getMakeByIdJSON from VehicleMakeIdProvider and return data', async () => {
      const mockVehicleByIdData = [
        { id: '1', make: 'Toyota', model: 'Corolla' },
      ];
      (vehicleMakeIdProvider.getMakeByIdJSON as jest.Mock).mockResolvedValue(
        mockVehicleByIdData,
      );

      const result = await vehicleDomService.getVehicleMakeByIdData('1');

      expect(vehicleMakeIdProvider.getMakeByIdJSON).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockVehicleByIdData);
    });
  });
});

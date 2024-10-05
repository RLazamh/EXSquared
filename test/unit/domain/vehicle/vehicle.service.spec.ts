import { Test, TestingModule } from '@nestjs/testing';
import { VehicleDomService } from '../../../../src/domain/vehicle/vehicle-dom.service';
import { VehicleMakesProvider } from '../../../../src/providers/apis/vehicle-makes.providers';
import { VehicleMakeIdProvider } from '../../../../src/providers/apis/vehicle-make-id.providers';

jest.mock('xml2js', () => ({
  parseStringPromise: jest.fn().mockResolvedValue({
    vehicles: [{ id: '1', make: 'Toyota', model: 'Corolla' }],
  }),
}));

describe('VehicleApiProvider (unit test)', () => {
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
            getVehiclexml: jest.fn(),
            getVehicleJSON: jest.fn(),
          }),
        },
        {
          provide: VehicleMakeIdProvider,
          useFactory: () => ({
            getVehiclexml: jest.fn(),
            getVehicleJSON: jest.fn(),
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
});

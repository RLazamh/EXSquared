import { Test, TestingModule } from '@nestjs/testing';
import { VehicleDomService } from '../../../../src/domain/vehicle/vehicle-dom.service';
import { VehicleApiProvider } from '../../../../src/providers/apis/vehicle-api.providers';

jest.mock('xml2js', () => ({
  parseStringPromise: jest.fn().mockResolvedValue({
    vehicles: [{ id: '1', make: 'Toyota', model: 'Corolla' }],
  }),
}));

describe('VehicleApiProvider (unit test)', () => {
  let vehicleDomService: VehicleDomService;
  let vehicleApiProvider: VehicleApiProvider;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        VehicleDomService,
        {
          provide: VehicleApiProvider,
          useFactory: () => ({
            getVehiclexml: jest.fn(),
            getVehicleJSON: jest.fn(),
          }),
        },
      ],
    }).compile();

    vehicleDomService = moduleFixture.get<VehicleDomService>(VehicleDomService);
    vehicleApiProvider =
      moduleFixture.get<VehicleApiProvider>(VehicleApiProvider);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(vehicleDomService).toBeDefined();
    expect(VehicleApiProvider).toBeDefined();
  });

  describe('getTransformedVehicleData', () => {
    it('should call VehicleApiProvider to get XML data and transform it to JSON', async () => {
      const mockJSONData = [{ Make_ID: '1', Make_Name: 'Toyota' }];
      (vehicleApiProvider.getVehicleJSON as jest.Mock).mockResolvedValue(
        mockJSONData,
      );

      const result = await vehicleDomService.getTransformedVehicleData();

      expect(vehicleApiProvider.getVehicleJSON).toHaveBeenCalledTimes(1);
      expect(result).toEqual([{ makeId: '1', makeName: 'Toyota' }]);
    });
  });
});

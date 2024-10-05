import { Test, TestingModule } from '@nestjs/testing';
import { parseStringPromise } from 'xml2js';
import { VehicleService } from '../../../../src/domain/vehicle/vehicle.service';
import { VehicleXmlProvider } from '../../../../src/providers/xml/vehicle-xml.providers';

jest.mock('xml2js', () => ({
  parseStringPromise: jest.fn().mockResolvedValue({
    vehicles: [{ id: '1', make: 'Toyota', model: 'Corolla' }],
  }),
}));

describe('VehicleService (unit test)', () => {
  let vehicleService: VehicleService;
  let vehicleXmlProvider: VehicleXmlProvider;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        VehicleService,
        {
          provide: VehicleXmlProvider,
          useFactory: () => ({
            getVehicleData: jest.fn(),
          }),
        },
      ],
    }).compile();

    vehicleService = moduleFixture.get<VehicleService>(VehicleService);
    vehicleXmlProvider =
      moduleFixture.get<VehicleXmlProvider>(VehicleXmlProvider);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(vehicleService).toBeDefined();
    expect(vehicleXmlProvider).toBeDefined();
  });

  describe('getTransformedVehicleData', () => {
    it('should call VehicleXmlProvider to get XML data and transform it to JSON', async () => {
      const mockXmlData =
        '<vehicles><vehicle><id>1</id><make>Toyota</make><model>Corolla</model></vehicle></vehicles>';
      (vehicleXmlProvider.getVehicleData as jest.Mock).mockResolvedValue(
        mockXmlData,
      );

      const result = await vehicleService.getTransformedVehicleData();

      expect(vehicleXmlProvider.getVehicleData).toHaveBeenCalledTimes(1);
      expect(parseStringPromise).toHaveBeenCalledWith(mockXmlData, {
        explicitArray: false,
        mergeAttrs: true,
      });
      expect(result).toEqual({
        vehicles: [{ id: '1', make: 'Toyota', model: 'Corolla' }],
      });
    });
  });
});

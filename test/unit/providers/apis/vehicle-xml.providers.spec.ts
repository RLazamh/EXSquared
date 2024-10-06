import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios';
import { VehicleMakesProvider } from '../../../../src/providers/apis/vehicle-makes.providers';

describe('VehicleApiProvider (unit test)', () => {
  let provider: VehicleMakesProvider;
  let httpService: HttpService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        VehicleMakesProvider,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    provider = moduleFixture.get<VehicleMakesProvider>(VehicleMakesProvider);
    httpService = moduleFixture.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
    expect(httpService).toBeDefined();
  });

  describe('getVehicleData', () => {
    it('GIVEN a request to the external API WHEN getVehicleData is called THEN it should return the expected XML data', async () => {
      const mockXmlData =
        '<vehicles><vehicle><id>1</id><make>Toyota</make></vehicle></vehicles>';
      const mockResponse: AxiosResponse = {
        data: mockXmlData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          headers: null,
        },
      };

      (httpService.get as jest.Mock).mockReturnValue(of(mockResponse));

      const result = await provider.getAllMakesXML();

      expect(httpService.get).toHaveBeenCalledTimes(1);
      expect(result).toBe(mockXmlData);
    });
  });
});

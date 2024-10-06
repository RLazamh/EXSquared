import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios';
import { VehicleMakesProvider } from '../../../../src/providers/apis/vehicle-makes.providers';
import { parseStringPromise } from 'xml2js';

jest.mock('xml2js', () => ({
  parseStringPromise: jest.fn(),
}));

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

    it('GIVEN a valid XML response WHEN getAllMakesJSON is called THEN it should return the expected JSON data', async () => {
      const mockXmlData =
        '<Response><Results><AllVehicleMakes><make>Toyota</make></AllVehicleMakes></Results></Response>';
      const mockJsonData = {
        Response: {
          Results: {
            AllVehicleMakes: [{ make: 'Toyota' }],
          },
        },
      };
      const mockResponse: AxiosResponse = {
        data: mockXmlData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          headers: null,
        },
      };

      // Mockear la respuesta XML del servicio HTTP
      (httpService.get as jest.Mock).mockReturnValue(of(mockResponse));
      // Mockear la conversión de XML a JSON
      (parseStringPromise as jest.Mock).mockResolvedValue(mockJsonData);

      const result = await provider.getAllMakesJSON();

      expect(httpService.get).toHaveBeenCalledTimes(1);
      expect(parseStringPromise).toHaveBeenCalledWith(mockXmlData, {
        explicitArray: false,
        mergeAttrs: true,
      });
      expect(result).toEqual([{ make: 'Toyota' }]);
    });
  });
});

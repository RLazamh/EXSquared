import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios';
import { parseStringPromise } from 'xml2js';
import { VehicleMakeIdProvider } from '../../../../src/providers/apis/vehicle-make-id.providers';
import { ENDPOINTS } from '../../../../src/providers/apis/endpoint';

jest.mock('xml2js', () => ({
  parseStringPromise: jest.fn(),
}));

describe('VehicleMakeIdProvider (unit test)', () => {
  let provider: VehicleMakeIdProvider;
  let httpService: HttpService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        VehicleMakeIdProvider,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    provider = moduleFixture.get<VehicleMakeIdProvider>(VehicleMakeIdProvider);
    httpService = moduleFixture.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
    expect(httpService).toBeDefined();
  });

  describe('getMakeByIdXML', () => {
    it('GIVEN a request to the external API WHEN getMakeByIdXML is called THEN it should return the expected XML data', async () => {
      const mockXmlData =
        '<Response><Results><VehicleTypesForMakeIds><id>1</id><make>Toyota</make></VehicleTypesForMakeIds></Results></Response>';
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

      const makeId = '1';
      const result = await provider.getMakeByIdXML(makeId);

      expect(httpService.get).toHaveBeenCalledTimes(1);
      expect(httpService.get).toHaveBeenCalledWith(
        `${process.env.BASE_URL_VEHICLE_PROVIDER}${ENDPOINTS.getMakeByIdXML(
          makeId,
        )}`,
      );
      expect(result).toBe(mockXmlData);
    });
  });

  describe('getMakeByIdJSON', () => {
    it('GIVEN a valid XML response WHEN getMakeByIdJSON is called THEN it should return the expected JSON data', async () => {
      const mockXmlData =
        '<Response><Results><VehicleTypesForMakeIds><id>1</id><make>Toyota</make></VehicleTypesForMakeIds></Results></Response>';
      const mockJsonData = {
        Response: {
          Results: {
            VehicleTypesForMakeIds: [{ id: '1', make: 'Toyota' }],
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

      const makeId = '1';
      const result = await provider.getMakeByIdJSON(makeId);

      expect(httpService.get).toHaveBeenCalledTimes(1);
      expect(parseStringPromise).toHaveBeenCalledWith(mockXmlData, {
        explicitArray: false,
        mergeAttrs: true,
      });
      expect(result).toEqual([{ id: '1', make: 'Toyota' }]);
    });
  });
});

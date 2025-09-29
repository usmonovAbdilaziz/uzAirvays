import { Test, TestingModule } from '@nestjs/testing';
import { CountriesController } from './countries.controller';
import { CountriesService } from './countries.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';

describe('CountriesController', () => {
  let controller: CountriesController;
  let service: CountriesService;

  const mockSuccessResponse = {
    statusCode: 200,
    message: 'success',
    data: {},
  };

  const mockCountriesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CountriesController],
      providers: [
        {
          provide: CountriesService,
          useValue: mockCountriesService,
        },
      ],
    }).compile();

    controller = module.get<CountriesController>(CountriesController);
    service = module.get<CountriesService>(CountriesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new country', async () => {
      const createCountryDto: CreateCountryDto = {
        name: 'Test Country',
        iso_code: 'TC',
      };

      const expectedResult = {
        ...mockSuccessResponse,
        statusCode: 201,
        data: { id: 1, ...createCountryDto },
      };

      mockCountriesService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createCountryDto);

      expect(service.create).toHaveBeenCalledWith(createCountryDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should return all countries', async () => {
      const countries = [{ id: 1, name: 'Test Country', iso_code: 'TC' }];
      const expectedResult = {
        ...mockSuccessResponse,
        data: countries,
      };

      mockCountriesService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return a country by id', async () => {
      const country = { id: 1, name: 'Test Country', iso_code: 'TC' };
      const expectedResult = {
        ...mockSuccessResponse,
        data: country,
      };

      mockCountriesService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne('1');

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should update a country', async () => {
      const updateCountryDto: UpdateCountryDto = {
        name: 'Updated Country',
      };
      const updatedCountry = { id: 1, name: 'Updated Country', iso_code: 'TC' };
      const expectedResult = {
        ...mockSuccessResponse,
        data: updatedCountry,
      };

      mockCountriesService.update.mockResolvedValue(expectedResult);

      const result = await controller.update('1', updateCountryDto);

      expect(service.update).toHaveBeenCalledWith(1, updateCountryDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('remove', () => {
    it('should remove a country', async () => {
      const expectedResult = {
        ...mockSuccessResponse,
        data: { message: 'Country  deleted successfully' },
      };

      mockCountriesService.remove.mockResolvedValue(expectedResult);

      const result = await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedResult);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { CitiesController } from './cities.controller';
import { CitiesService } from './cities.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';

describe('CitiesController', () => {
  let controller: CitiesController;
  let service: CitiesService;

  const mockSuccessResponse = {
    statusCode: 200,
    message: 'success',
    data: {},
  };

  const mockCitiesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CitiesController],
      providers: [
        {
          provide: CitiesService,
          useValue: mockCitiesService,
        },
      ],
    }).compile();

    controller = module.get<CitiesController>(CitiesController);
    service = module.get<CitiesService>(CitiesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new city', async () => {
      const createCityDto: CreateCityDto = {
        name: 'Test City',
        country_id: 1,
      };

      const expectedResult = {
        ...mockSuccessResponse,
        statusCode: 201,
        data: { id: 1, ...createCityDto },
      };

      mockCitiesService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createCityDto);

      expect(service.create).toHaveBeenCalledWith(createCityDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should return all cities', async () => {
      const cities = [{ id: 1, name: 'Test City', country_id: 1 }];
      const expectedResult = {
        ...mockSuccessResponse,
        data: cities,
      };

      mockCitiesService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return a city by id', async () => {
      const city = { id: 1, name: 'Test City', country_id: 1 };
      const expectedResult = {
        ...mockSuccessResponse,
        data: city,
      };

      mockCitiesService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne('1');

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should update a city', async () => {
      const updateCityDto: UpdateCityDto = {
        name: 'Updated City',
      };
      const updatedCity = { id: 1, name: 'Updated City', country_id: 1 };
      const expectedResult = {
        ...mockSuccessResponse,
        data: updatedCity,
      };

      mockCitiesService.update.mockResolvedValue(expectedResult);

      const result = await controller.update('1', updateCityDto);

      expect(service.update).toHaveBeenCalledWith(1, updateCityDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('remove', () => {
    it('should remove a city', async () => {
      const expectedResult = {
        ...mockSuccessResponse,
        data: { message: 'City deleted successfully' },
      };

      mockCitiesService.remove.mockResolvedValue(expectedResult);

      const result = await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedResult);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { CitiesService } from './cities.service';
import { getModelToken } from '@nestjs/sequelize';
import { City } from './entities/city.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { CountriesService } from '../countries/countries.service';

// Mock the helper functions
const mockHandleError = jest.fn();
const mockSuccessMessage = jest.fn();

jest.doMock('../../helps/http-filter.response', () => ({
  handleError: mockHandleError,
  successMessage: mockSuccessMessage,
}));

describe('CitiesService', () => {
  let service: CitiesService;
  let mockCityModel: any;
  let mockCountriesService: any;

  const mockCity = {
    id: 1,
    name: 'Test City',
    country_id: 1,
    country: {
      id: 1,
      name: 'Test Country',
      iso_code: 'TC',
    },
  };

  const mockCountry = {
    id: 1,
    name: 'Test Country',
    iso_code: 'TC',
  };

  beforeEach(async () => {
    // Reset mocks
    mockHandleError.mockImplementation((error) => {
      throw error;
    });
    mockSuccessMessage.mockImplementation((data, code = 200) => ({
      statusCode: code,
      message: 'success',
      data,
    }));

    mockCityModel = {
      create: jest.fn(),
      findOne: jest.fn(),
      findAll: jest.fn(),
      findByPk: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
    };

    mockCountriesService = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CitiesService,
        {
          provide: getModelToken(City),
          useValue: mockCityModel,
        },
        {
          provide: CountriesService,
          useValue: mockCountriesService,
        },
      ],
    }).compile();

    service = module.get<CitiesService>(CitiesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createCityDto: CreateCityDto = {
      name: 'Test City',
      country_id: 1,
    };

    it('should create a new city successfully', async () => {
      mockCountriesService.findOne.mockResolvedValue(mockCountry);
      mockCityModel.findOne.mockResolvedValue(null);
      mockCityModel.create.mockResolvedValue(mockCity);

      await service.create(createCityDto);

      expect(mockCountriesService.findOne).toHaveBeenCalledWith(1);
      expect(mockCityModel.findOne).toHaveBeenCalledWith({
        where: { name: 'Test City' },
      });
      expect(mockCityModel.create).toHaveBeenCalledWith(createCityDto);
      expect(mockSuccessMessage).toHaveBeenCalledWith(mockCity, 201);
    });

    it('should throw NotFoundException if country not found', async () => {
      mockCountriesService.findOne.mockResolvedValue(null);
      mockHandleError.mockImplementation((error) => {
        throw error;
      });

      await expect(service.create(createCityDto)).rejects.toThrow();
      expect(mockCityModel.create).not.toHaveBeenCalled();
    });

    it('should throw ConflictException if city already exists', async () => {
      mockCountriesService.findOne.mockResolvedValue(mockCountry);
      mockCityModel.findOne.mockResolvedValue(mockCity);
      mockHandleError.mockImplementation((error) => {
        throw error;
      });

      await expect(service.create(createCityDto)).rejects.toThrow();
      expect(mockCityModel.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all cities with relations', async () => {
      const cities = [mockCity];
      mockCityModel.findAll.mockResolvedValue(cities);

      await service.findAll();

      expect(mockCityModel.findAll).toHaveBeenCalledWith({
        include: { all: true },
      });
      expect(mockSuccessMessage).toHaveBeenCalledWith(cities, 200);
    });
  });

  describe('findOne', () => {
    it('should return a city by id with relations', async () => {
      mockCityModel.findByPk.mockResolvedValue(mockCity);

      await service.findOne(1);

      expect(mockCityModel.findByPk).toHaveBeenCalledWith(1, {
        include: { all: true },
      });
      expect(mockSuccessMessage).toHaveBeenCalledWith(mockCity, 200);
    });

    it('should throw NotFoundException if city not found', async () => {
      mockCityModel.findByPk.mockResolvedValue(null);
      mockHandleError.mockImplementation((error) => {
        throw error;
      });

      await expect(service.findOne(1)).rejects.toThrow();
    });
  });

  describe('update', () => {
    const updateCityDto: UpdateCityDto = {
      name: 'Updated City',
    };

    it('should update a city successfully', async () => {
      const updatedCity = { ...mockCity, name: 'Updated City' };
      mockCityModel.update.mockResolvedValue([1, [updatedCity]]);

      await service.update(1, updateCityDto);

      expect(mockCityModel.update).toHaveBeenCalledWith(updateCityDto, {
        where: { id: 1 },
        returning: true,
      });
      expect(mockSuccessMessage).toHaveBeenCalledWith(updatedCity, 200);
    });

    it('should throw NotFoundException if city not found', async () => {
      mockCityModel.update.mockResolvedValue([0, []]);
      mockHandleError.mockImplementation((error) => {
        throw error;
      });

      await expect(service.update(1, updateCityDto)).rejects.toThrow();
    });
  });

  describe('remove', () => {
    it('should remove a city successfully', async () => {
      mockCityModel.destroy.mockResolvedValue(1);

      await service.remove(1);

      expect(mockCityModel.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockSuccessMessage).toHaveBeenCalledWith(
        { message: 'City deleted successfully' },
        200,
      );
    });

    it('should throw NotFoundException if city not found', async () => {
      mockCityModel.destroy.mockResolvedValue(0);
      mockHandleError.mockImplementation((error) => {
        throw error;
      });

      await expect(service.remove(1)).rejects.toThrow();
    });
  });
});

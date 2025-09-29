import { Test, TestingModule } from '@nestjs/testing';
import { CountriesService } from './countries.service';
import { getModelToken } from '@nestjs/sequelize';
import { Country } from './entities/country.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';

// Mock the helper functions
const mockHandleError = jest.fn();
const mockSuccessMessage = jest.fn();

jest.doMock('../../helps/http-filter.response', () => ({
  handleError: mockHandleError,
  successMessage: mockSuccessMessage,
}));

describe('CountriesService', () => {
  let service: CountriesService;
  let mockCountryModel: any;

  const mockCountry = {
    id: 1,
    name: 'Test Country',
    iso_code: 'TC',
    cities: [],
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

    mockCountryModel = {
      create: jest.fn(),
      findOne: jest.fn(),
      findAll: jest.fn(),
      findByPk: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CountriesService,
        {
          provide: getModelToken(Country),
          useValue: mockCountryModel,
        },
      ],
    }).compile();

    service = module.get<CountriesService>(CountriesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createCountryDto: CreateCountryDto = {
      name: 'Test Country',
      iso_code: 'TC',
    };

    it('should create a new country successfully', async () => {
      mockCountryModel.findOne.mockResolvedValue(null);
      mockCountryModel.create.mockResolvedValue(mockCountry);

      await service.create(createCountryDto);

      expect(mockCountryModel.findOne).toHaveBeenCalledWith({
        where: { name: 'Test Country' },
      });
      expect(mockCountryModel.create).toHaveBeenCalledWith(createCountryDto);
      expect(mockSuccessMessage).toHaveBeenCalledWith(mockCountry, 201);
    });

    it('should throw BadRequestException if country already exists', async () => {
      mockCountryModel.findOne.mockResolvedValue(mockCountry);
      mockHandleError.mockImplementation((error) => {
        throw error;
      });

      await expect(service.create(createCountryDto)).rejects.toThrow();
      expect(mockCountryModel.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all countries with relations', async () => {
      const countries = [mockCountry];
      mockCountryModel.findAll.mockResolvedValue(countries);

      await service.findAll();

      expect(mockCountryModel.findAll).toHaveBeenCalledWith({
        include: { all: true },
      });
      expect(mockSuccessMessage).toHaveBeenCalledWith(countries, 200);
    });
  });

  describe('findOne', () => {
    it('should return a country by id with relations', async () => {
      mockCountryModel.findByPk.mockResolvedValue(mockCountry);

      await service.findOne(1);

      expect(mockCountryModel.findByPk).toHaveBeenCalledWith(1, {
        include: { all: true },
      });
      expect(mockSuccessMessage).toHaveBeenCalledWith(mockCountry, 200);
    });

    it('should throw NotFoundException if country not found', async () => {
      mockCountryModel.findByPk.mockResolvedValue(null);
      mockHandleError.mockImplementation((error) => {
        throw error;
      });

      await expect(service.findOne(1)).rejects.toThrow();
    });
  });

  describe('update', () => {
    const updateCountryDto: UpdateCountryDto = {
      name: 'Updated Country',
    };

    it('should update a country successfully', async () => {
      const updatedCountry = { ...mockCountry, name: 'Updated Country' };
      mockCountryModel.update.mockResolvedValue([1, [updatedCountry]]);

      await service.update(1, updateCountryDto);

      expect(mockCountryModel.update).toHaveBeenCalledWith(updateCountryDto, {
        where: { id: 1 },
        returning: true,
      });
      expect(mockSuccessMessage).toHaveBeenCalledWith(updatedCountry, 200);
    });

    it('should throw NotFoundException if country not found', async () => {
      mockCountryModel.update.mockResolvedValue([0, []]);
      mockHandleError.mockImplementation((error) => {
        throw error;
      });

      await expect(service.update(1, updateCountryDto)).rejects.toThrow();
    });
  });

  describe('remove', () => {
    it('should remove a country successfully', async () => {
      mockCountryModel.destroy.mockResolvedValue(1);

      await service.remove(1);

      expect(mockCountryModel.destroy).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockSuccessMessage).toHaveBeenCalledWith(
        { message: 'Country  deleted successfully' },
        200,
      );
    });

    it('should throw NotFoundException if country not found', async () => {
      mockCountryModel.destroy.mockResolvedValue(0);
      mockHandleError.mockImplementation((error) => {
        throw error;
      });

      await expect(service.remove(1)).rejects.toThrow();
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { CompaniesService } from './companies.service';
import { getModelToken } from '@nestjs/sequelize';
import { Company } from './entities/company.entity';
import { ConflictException } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

// Mock the companies service methods directly
const mockHandleError = jest.fn();
const mockSuccessMessage = jest.fn();

jest.doMock('../../helps/http-filter.response', () => ({
  handleError: mockHandleError,
  successMessage: mockSuccessMessage,
}));

describe('CompaniesService', () => {
  let service: CompaniesService;
  let mockCompanyModel: any;

  const mockCompany = {
    id: 1,
    name: 'Test Company',
    code: 'TEST001',
    website: 'https://test.com',
    update: jest.fn(),
    destroy: jest.fn(),
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

    mockCompanyModel = {
      create: jest.fn(),
      findOne: jest.fn(),
      findAll: jest.fn(),
      findByPk: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompaniesService,
        {
          provide: getModelToken(Company),
          useValue: mockCompanyModel,
        },
      ],
    }).compile();

    service = module.get<CompaniesService>(CompaniesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createCompanyDto: CreateCompanyDto = {
      name: 'Test Company',
      code: 'TEST001',
      website: 'https://test.com',
    };

    it('should create a new company successfully', async () => {
      mockCompanyModel.findOne.mockResolvedValue(null);
      mockCompanyModel.create.mockResolvedValue(mockCompany);

      const result = await service.create(createCompanyDto);

      expect(mockCompanyModel.findOne).toHaveBeenCalledWith({
        where: { code: 'TEST001' },
      });
      expect(mockCompanyModel.create).toHaveBeenCalledWith(createCompanyDto);
      expect(mockSuccessMessage).toHaveBeenCalledWith(mockCompany, 201);
    });

    it('should throw ConflictException if company already exists', async () => {
      mockCompanyModel.findOne.mockResolvedValue(mockCompany);
      mockHandleError.mockImplementation((error) => {
        throw error;
      });

      await expect(service.create(createCompanyDto)).rejects.toThrow();
      expect(mockCompanyModel.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all companies', async () => {
      const companies = [mockCompany];
      mockCompanyModel.findAll.mockResolvedValue(companies);

      await service.findAll();

      expect(mockCompanyModel.findAll).toHaveBeenCalled();
      expect(mockSuccessMessage).toHaveBeenCalledWith(companies, 200);
    });
  });

  describe('findOne', () => {
    it('should return a company by id', async () => {
      mockCompanyModel.findByPk.mockResolvedValue(mockCompany);

      await service.findOne(1);

      expect(mockCompanyModel.findByPk).toHaveBeenCalledWith(1);
      expect(mockSuccessMessage).toHaveBeenCalledWith(mockCompany, 200);
    });

    it('should throw ConflictException if company not found', async () => {
      mockCompanyModel.findByPk.mockResolvedValue(null);
      mockHandleError.mockImplementation((error) => {
        throw error;
      });

      await expect(service.findOne(1)).rejects.toThrow();
    });
  });

  describe('update', () => {
    const updateCompanyDto: UpdateCompanyDto = {
      name: 'Updated Company',
    };

    it('should update a company successfully', async () => {
      mockCompanyModel.findByPk.mockResolvedValue(mockCompany);
      mockCompany.update.mockResolvedValue(mockCompany);

      await service.update(1, updateCompanyDto);

      expect(mockCompanyModel.findByPk).toHaveBeenCalledWith(1);
      expect(mockCompany.update).toHaveBeenCalledWith(updateCompanyDto);
      expect(mockSuccessMessage).toHaveBeenCalledWith(mockCompany, 200);
    });

    it('should throw ConflictException if company not found', async () => {
      mockCompanyModel.findByPk.mockResolvedValue(null);
      mockHandleError.mockImplementation((error) => {
        throw error;
      });

      await expect(service.update(1, updateCompanyDto)).rejects.toThrow();
    });
  });

  describe('remove', () => {
    it('should remove a company successfully', async () => {
      mockCompanyModel.findByPk.mockResolvedValue(mockCompany);
      mockCompany.destroy.mockResolvedValue(true);

      await service.remove(1);

      expect(mockCompanyModel.findByPk).toHaveBeenCalledWith(1);
      expect(mockCompany.destroy).toHaveBeenCalled();
      expect(mockSuccessMessage).toHaveBeenCalledWith(
        { message: 'Company deleted successfully' },
        200,
      );
    });

    it('should throw ConflictException if company not found', async () => {
      mockCompanyModel.findByPk.mockResolvedValue(null);
      mockHandleError.mockImplementation((error) => {
        throw error;
      });

      await expect(service.remove(1)).rejects.toThrow();
    });
  });
});

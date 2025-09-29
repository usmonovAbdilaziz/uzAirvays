import { Test, TestingModule } from '@nestjs/testing';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

describe('CompaniesController', () => {
  let controller: CompaniesController;
  let service: CompaniesService;

  const mockSuccessResponse = {
    statusCode: 200,
    message: 'success',
    data: {},
  };

  const mockCompaniesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompaniesController],
      providers: [
        {
          provide: CompaniesService,
          useValue: mockCompaniesService,
        },
      ],
    }).compile();

    controller = module.get<CompaniesController>(CompaniesController);
    service = module.get<CompaniesService>(CompaniesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new company', async () => {
      const createCompanyDto: CreateCompanyDto = {
        name: 'Test Company',
        code: 'TEST001',
        website: 'https://test.com',
      };

      const expectedResult = {
        ...mockSuccessResponse,
        statusCode: 201,
        data: { id: 1, ...createCompanyDto },
      };

      mockCompaniesService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createCompanyDto);

      expect(service.create).toHaveBeenCalledWith(createCompanyDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should return all companies', async () => {
      const companies = [{ id: 1, name: 'Test Company', code: 'TEST001' }];
      const expectedResult = {
        ...mockSuccessResponse,
        data: companies,
      };

      mockCompaniesService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return a company by id', async () => {
      const company = { id: 1, name: 'Test Company', code: 'TEST001' };
      const expectedResult = {
        ...mockSuccessResponse,
        data: company,
      };

      mockCompaniesService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne('1');

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should update a company', async () => {
      const updateCompanyDto: UpdateCompanyDto = {
        name: 'Updated Company',
      };
      const updatedCompany = {
        id: 1,
        name: 'Updated Company',
        code: 'TEST001',
      };
      const expectedResult = {
        ...mockSuccessResponse,
        data: updatedCompany,
      };

      mockCompaniesService.update.mockResolvedValue(expectedResult);

      const result = await controller.update('1', updateCompanyDto);

      expect(service.update).toHaveBeenCalledWith(1, updateCompanyDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('remove', () => {
    it('should remove a company', async () => {
      const expectedResult = {
        ...mockSuccessResponse,
        data: { message: 'Company deleted successfully' },
      };

      mockCompaniesService.remove.mockResolvedValue(expectedResult);

      const result = await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedResult);
    });
  });
});

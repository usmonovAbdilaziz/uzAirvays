import { Test, TestingModule } from '@nestjs/testing';
import { LoyaltyProgramsService } from './loyalty_programs.service';
import { getModelToken } from '@nestjs/sequelize';
import { LoyaltyProgram } from './entities/loyalty_program.entity';

// Mock helpers
const mockHandleError = jest.fn();
const mockSuccessMessage = jest.fn();
jest.doMock('../../helps/http-filter.response', () => ({
  handleError: mockHandleError,
  successMessage: mockSuccessMessage,
}));

describe('LoyaltyProgramsService', () => {
  let service: LoyaltyProgramsService;
  let mockLoyaltyProgramModel: any;

  beforeEach(async () => {
    mockHandleError.mockImplementation((error) => {
      throw error;
    });
    mockSuccessMessage.mockImplementation((data, code = 200) => ({
      statusCode: code,
      message: 'success',
      data,
    }));

    mockLoyaltyProgramModel = {
      create: jest.fn(),
      findAll: jest.fn(),
      findByPk: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoyaltyProgramsService,
        {
          provide: getModelToken(LoyaltyProgram),
          useValue: mockLoyaltyProgramModel,
        },
      ],
    }).compile();

    service = module.get<LoyaltyProgramsService>(LoyaltyProgramsService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('CRUD operations', () => {
    const mockProgram = { id: 1, name: 'Gold Program', points_required: 1000 };

    it('should create loyalty program', async () => {
      mockLoyaltyProgramModel.create.mockResolvedValue(mockProgram);
      await service.create({} as any);
      expect(mockLoyaltyProgramModel.create).toHaveBeenCalled();
    });

    it('should find all programs', async () => {
      mockLoyaltyProgramModel.findAll.mockResolvedValue([mockProgram]);
      await service.findAll();
      expect(mockLoyaltyProgramModel.findAll).toHaveBeenCalled();
    });

    it('should find one program', async () => {
      mockLoyaltyProgramModel.findByPk.mockResolvedValue(mockProgram);
      await service.findOne(1);
      expect(mockLoyaltyProgramModel.findByPk).toHaveBeenCalledWith(1);
    });

    it('should update program', async () => {
      mockLoyaltyProgramModel.update.mockResolvedValue([1, [mockProgram]]);
      await service.update(1, {} as any);
      expect(mockLoyaltyProgramModel.update).toHaveBeenCalled();
    });

    it('should remove program', async () => {
      mockLoyaltyProgramModel.destroy.mockResolvedValue(1);
      await service.remove(1);
      expect(mockLoyaltyProgramModel.destroy).toHaveBeenCalled();
    });
  });
});

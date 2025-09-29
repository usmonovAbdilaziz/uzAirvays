import { Test, TestingModule } from '@nestjs/testing';
import { LoyaltyProgramsController } from './loyalty_programs.controller';
import { LoyaltyProgramsService } from './loyalty_programs.service';

describe('LoyaltyProgramsController', () => {
  let controller: LoyaltyProgramsController;
  let service: LoyaltyProgramsService;

  const mockLoyaltyProgramsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoyaltyProgramsController],
      providers: [
        {
          provide: LoyaltyProgramsService,
          useValue: mockLoyaltyProgramsService,
        },
      ],
    }).compile();

    controller = module.get<LoyaltyProgramsController>(
      LoyaltyProgramsController,
    );
    service = module.get<LoyaltyProgramsService>(LoyaltyProgramsService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('CRUD operations', () => {
    it('should handle all CRUD operations', async () => {
      const mockResponse = { statusCode: 200, data: {} };
      mockLoyaltyProgramsService.create.mockResolvedValue(mockResponse);
      mockLoyaltyProgramsService.findAll.mockResolvedValue(mockResponse);
      mockLoyaltyProgramsService.findOne.mockResolvedValue(mockResponse);
      mockLoyaltyProgramsService.update.mockResolvedValue(mockResponse);
      mockLoyaltyProgramsService.remove.mockResolvedValue(mockResponse);

      await controller.create({} as any);
      await controller.findAll();
      await controller.findOne('1');
      await controller.update('1', {} as any);
      await controller.remove('1');

      expect(service.create).toHaveBeenCalled();
      expect(service.findAll).toHaveBeenCalled();
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(service.update).toHaveBeenCalledWith(1, {});
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});

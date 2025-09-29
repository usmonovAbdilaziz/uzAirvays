import { Test, TestingModule } from '@nestjs/testing';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';

describe('NewsController', () => {
  let controller: NewsController;
  let service: NewsService;

  const mockNewsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NewsController],
      providers: [{ provide: NewsService, useValue: mockNewsService }],
    }).compile();

    controller = module.get<NewsController>(NewsController);
    service = module.get<NewsService>(NewsService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('CRUD operations', () => {
    it('should handle all CRUD operations', async () => {
      const mockResponse = { statusCode: 200, data: {} };
      mockNewsService.create.mockResolvedValue(mockResponse);
      mockNewsService.findAll.mockResolvedValue(mockResponse);
      mockNewsService.findOne.mockResolvedValue(mockResponse);
      mockNewsService.update.mockResolvedValue(mockResponse);
      mockNewsService.remove.mockResolvedValue(mockResponse);

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

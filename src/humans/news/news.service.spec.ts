import { Test, TestingModule } from '@nestjs/testing';
import { NewsService } from './news.service';
import { getModelToken } from '@nestjs/sequelize';
import { News } from './entities/news.entity';

// Mock helpers
const mockHandleError = jest.fn();
const mockSuccessMessage = jest.fn();
jest.doMock('../../helps/http-filter.response', () => ({
  handleError: mockHandleError,
  successMessage: mockSuccessMessage,
}));

describe('NewsService', () => {
  let service: NewsService;
  let mockNewsModel: any;

  beforeEach(async () => {
    mockHandleError.mockImplementation((error) => {
      throw error;
    });
    mockSuccessMessage.mockImplementation((data, code = 200) => ({
      statusCode: code,
      message: 'success',
      data,
    }));

    mockNewsModel = {
      create: jest.fn(),
      findAll: jest.fn(),
      findByPk: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NewsService,
        { provide: getModelToken(News), useValue: mockNewsModel },
      ],
    }).compile();

    service = module.get<NewsService>(NewsService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('CRUD operations', () => {
    const mockNews = { id: 1, title: 'Test News', content: 'Test content' };

    it('should create news', async () => {
      const createDto = {
        title: 'Test',
        content: 'Content',
        user_id: 1,
        image_url: 'https://example.com/image.jpg',
        is_published: true,
      };
      mockNewsModel.create.mockResolvedValue(mockNews);
      await service.create(createDto as any);
      expect(mockNewsModel.create).toHaveBeenCalled();
    });

    it('should find all news', async () => {
      mockNewsModel.findAll.mockResolvedValue([mockNews]);
      await service.findAll();
      expect(mockNewsModel.findAll).toHaveBeenCalled();
    });

    it('should find one news', async () => {
      mockNewsModel.findByPk.mockResolvedValue(mockNews);
      await service.findOne(1);
      expect(mockNewsModel.findByPk).toHaveBeenCalledWith(1);
    });

    it('should update news', async () => {
      mockNewsModel.update.mockResolvedValue([1, [mockNews]]);
      await service.update(1, { title: 'Updated' });
      expect(mockNewsModel.update).toHaveBeenCalled();
    });

    it('should remove news', async () => {
      mockNewsModel.destroy.mockResolvedValue(1);
      await service.remove(1);
      expect(mockNewsModel.destroy).toHaveBeenCalled();
    });
  });
});

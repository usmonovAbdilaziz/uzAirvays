import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { SeedService } from './seed.service';
import { User } from '../users/entities/user.entity';
import { AdminRole } from '../Roles/roles';
import * as bcryptjs from 'bcryptjs';

jest.mock('bcryptjs');

describe('SeedService', () => {
  let service: SeedService;
  let mockUserModel: any;

  const mockSuperAdmin = {
    id: 1,
    email: 'superadmin@uzairways.com',
    full_name: 'Super Administrator',
    role: AdminRole.SUPERADMIN,
    is_active: true,
  };

  beforeEach(async () => {
    mockUserModel = {
      findOne: jest.fn(),
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeedService,
        {
          provide: getModelToken(User),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<SeedService>(SeedService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createSuperAdmin', () => {
    it('should create superadmin when none exists', async () => {
      mockUserModel.findOne.mockResolvedValue(null);
      mockUserModel.create.mockResolvedValue(mockSuperAdmin);
      (bcryptjs.hash as jest.Mock).mockResolvedValue('hashedSuperadmin123');

      await service.createSuperAdmin();

      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        where: { role: AdminRole.SUPERADMIN },
      });
      expect(bcryptjs.hash).toHaveBeenCalledWith('superadmin123', 10);
      expect(mockUserModel.create).toHaveBeenCalledWith({
        email: 'superadmin@uzairways.com',
        full_name: 'Super Administrator',
        password: 'hashedSuperadmin123',
        role: AdminRole.SUPERADMIN,
        loyality_points: 0,
        is_active: true,
      });
    });

    it('should not create superadmin when one already exists', async () => {
      mockUserModel.findOne.mockResolvedValue(mockSuperAdmin);

      await service.createSuperAdmin();

      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        where: { role: AdminRole.SUPERADMIN },
      });
      expect(mockUserModel.create).not.toHaveBeenCalled();
      expect(bcryptjs.hash).not.toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      mockUserModel.findOne.mockRejectedValue(new Error('Database error'));

      // Should not throw, just log error
      await expect(service.createSuperAdmin()).resolves.not.toThrow();
      expect(mockUserModel.create).not.toHaveBeenCalled();
    });
  });

  describe('runSeeds', () => {
    it('should run all seed operations', async () => {
      mockUserModel.findOne.mockResolvedValue(null);
      mockUserModel.create.mockResolvedValue(mockSuperAdmin);
      (bcryptjs.hash as jest.Mock).mockResolvedValue('hashedSuperadmin123');

      await service.runSeeds();

      expect(mockUserModel.findOne).toHaveBeenCalled();
    });

    it('should handle errors in seed operations', async () => {
      mockUserModel.findOne.mockRejectedValue(new Error('Database error'));

      // Should not throw, just log error
      await expect(service.runSeeds()).resolves.not.toThrow();
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CryptoService } from '../utils/hashed-password';
import { AdminRole } from '../Roles/roles';

// Mock the helper functions
const mockHandleError = jest.fn();
const mockSuccessMessage = jest.fn();

jest.doMock('../helps/http-filter.response', () => ({
  handleError: mockHandleError,
  successMessage: mockSuccessMessage,
}));

describe('UsersService', () => {
  let service: UsersService;
  let mockUserModel: any;
  let mockCryptoService: any;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    full_name: 'Test User',
    password: 'hashedPassword',
    role: AdminRole.USER,
    loyality_points: 0,
    is_active: true,
    news: [],
    bookings: [],
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

    mockUserModel = {
      create: jest.fn(),
      findOne: jest.fn(),
      findAll: jest.fn(),
      findByPk: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
    };

    mockCryptoService = {
      encrypt: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User),
          useValue: mockUserModel,
        },
        {
          provide: CryptoService,
          useValue: mockCryptoService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      email: 'test@example.com',
      full_name: 'Test User',
      password: 'plainPassword',
      role: AdminRole.USER,
      loyality_points: 0,
      is_active: true,
    };

    it('should create a new user successfully', async () => {
      mockUserModel.findOne.mockResolvedValue(null);
      mockCryptoService.encrypt.mockResolvedValue('hashedPassword');
      mockUserModel.create.mockResolvedValue(mockUser);

      await service.create(createUserDto);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(mockCryptoService.encrypt).toHaveBeenCalledWith('plainPassword');
      expect(mockUserModel.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: 'hashedPassword',
      });
      expect(mockSuccessMessage).toHaveBeenCalledWith(mockUser, 201);
    });

    it('should throw ConflictException if email already exists', async () => {
      mockUserModel.findOne.mockResolvedValue(mockUser);
      mockHandleError.mockImplementation((error) => {
        throw error;
      });

      await expect(service.create(createUserDto)).rejects.toThrow();
      expect(mockCryptoService.encrypt).not.toHaveBeenCalled();
      expect(mockUserModel.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all users with relations', async () => {
      const users = [mockUser];
      mockUserModel.findAll.mockResolvedValue(users);

      await service.findAll();

      expect(mockUserModel.findAll).toHaveBeenCalledWith({
        include: { all: true },
      });
      expect(mockSuccessMessage).toHaveBeenCalledWith(users, 200);
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email with relations', async () => {
      mockUserModel.findOne.mockResolvedValue(mockUser);

      await service.findByEmail('test@example.com');

      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        include: { all: true },
      });
      expect(mockSuccessMessage).toHaveBeenCalledWith(mockUser, 200);
    });

    it('should return null if user not found by email', async () => {
      mockUserModel.findOne.mockResolvedValue(null);

      const result = await service.findByEmail('notfound@example.com');

      expect(result).toBeNull();
    });
  });

  describe('findOne', () => {
    it('should return a user by id with relations', async () => {
      mockUserModel.findByPk.mockResolvedValue(mockUser);

      await service.findOne(1);

      expect(mockUserModel.findByPk).toHaveBeenCalledWith(1, {
        include: { all: true },
      });
      expect(mockSuccessMessage).toHaveBeenCalledWith(mockUser, 200);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserModel.findByPk.mockResolvedValue(null);
      mockHandleError.mockImplementation((error) => {
        throw error;
      });

      await expect(service.findOne(1)).rejects.toThrow();
    });
  });

  describe('update', () => {
    const updateUserDto: UpdateUserDto = {
      full_name: 'Updated User',
    };

    it('should update a user successfully', async () => {
      const updatedUser = { ...mockUser, full_name: 'Updated User' };
      mockUserModel.update.mockResolvedValue([1, [updatedUser]]);

      await service.update(1, updateUserDto);

      expect(mockUserModel.update).toHaveBeenCalledWith(updateUserDto, {
        where: { id: 1 },
        returning: true,
      });
      expect(mockSuccessMessage).toHaveBeenCalledWith(updatedUser, 200);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserModel.update.mockResolvedValue([0, []]);
      mockHandleError.mockImplementation((error) => {
        throw error;
      });

      await expect(service.update(1, updateUserDto)).rejects.toThrow();
    });
  });

  describe('remove', () => {
    it('should remove a user successfully', async () => {
      mockUserModel.destroy.mockResolvedValue(1);

      await service.remove(1);

      expect(mockUserModel.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockSuccessMessage).toHaveBeenCalledWith(
        { message: 'Delete user from id' },
        200,
      );
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserModel.destroy.mockResolvedValue(0);
      mockHandleError.mockImplementation((error) => {
        throw error;
      });

      await expect(service.remove(1)).rejects.toThrow();
    });
  });
});

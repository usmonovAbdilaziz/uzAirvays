import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AdminRole } from '../Roles/roles';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockSuccessResponse = {
    statusCode: 200,
    message: 'success',
    data: {},
  };

  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        full_name: 'Test User',
        password: 'plainPassword',
        role: AdminRole.USER,
        loyality_points: 0,
        is_active: true,
      };

      const expectedResult = {
        ...mockSuccessResponse,
        statusCode: 201,
        data: { id: 1, ...createUserDto, password: 'hashedPassword' },
      };

      mockUsersService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createUserDto);

      expect(service.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [
        {
          id: 1,
          email: 'test@example.com',
          full_name: 'Test User',
          role: AdminRole.USER,
        },
      ];
      const expectedResult = {
        ...mockSuccessResponse,
        data: users,
      };

      mockUsersService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        full_name: 'Test User',
        role: AdminRole.USER,
      };
      const expectedResult = {
        ...mockSuccessResponse,
        data: user,
      };

      mockUsersService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne('1');

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = {
        full_name: 'Updated User',
      };
      const updatedUser = {
        id: 1,
        email: 'test@example.com',
        full_name: 'Updated User',
        role: AdminRole.USER,
      };
      const expectedResult = {
        ...mockSuccessResponse,
        data: updatedUser,
      };

      mockUsersService.update.mockResolvedValue(expectedResult);

      const result = await controller.update('1', updateUserDto);

      expect(service.update).toHaveBeenCalledWith(1, updateUserDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const expectedResult = {
        ...mockSuccessResponse,
        data: { message: 'Delete user from id' },
      };

      mockUsersService.remove.mockResolvedValue(expectedResult);

      const result = await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedResult);
    });
  });
});

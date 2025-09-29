import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AdminRole } from '../Roles/roles';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    login: jest.fn(),
    refreshToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return access and refresh tokens', async () => {
      const loginDto: LoginDto = {
        email: 'test@uzairways.com',
        password: 'password123',
      };

      const expectedResult = {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        user: {
          id: 1,
          email: 'test@uzairways.com',
          full_name: 'Test User',
          role: AdminRole.USER,
          is_active: true,
        },
      };

      mockAuthService.login.mockResolvedValue(expectedResult);

      const result = await controller.login(loginDto);

      expect(service.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('refreshToken', () => {
    it('should return new access token', async () => {
      const refreshToken = 'valid-refresh-token';
      const expectedResult = {
        access_token: 'new-access-token',
      };

      mockAuthService.refreshToken.mockResolvedValue(expectedResult);

      const result = await controller.refreshToken(refreshToken);

      expect(service.refreshToken).toHaveBeenCalledWith(refreshToken);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getProfile', () => {
    it('should return user profile from request', () => {
      const mockRequest = {
        user: {
          id: 1,
          email: 'test@uzairways.com',
          role: AdminRole.USER,
          full_name: 'Test User',
        },
      };

      const result = controller.getProfile(mockRequest);

      expect(result).toEqual({
        message: "Profil ma'lumotlari",
        user: mockRequest.user,
      });
    });
  });
});

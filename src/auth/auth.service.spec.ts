import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CryptoService } from '../utils/hashed-password';
import { UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AdminRole } from '../Roles/roles';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let cryptoService: CryptoService;

  const mockUser = {
    id: 1,
    email: 'test@uzairways.com',
    full_name: 'Test User',
    password: 'hashedPassword123',
    role: AdminRole.USER,
    is_active: true,
  };

  const mockUsersService = {
    findByEmail: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  const mockCryptoService = {
    compare: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: CryptoService,
          useValue: mockCryptoService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    cryptoService = module.get<CryptoService>(CryptoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user data without password when credentials are valid', async () => {
      const userResponse = { data: mockUser };
      mockUsersService.findByEmail.mockResolvedValue(userResponse);
      mockCryptoService.compare.mockResolvedValue(true);

      const result = await service.validateUser(
        'test@uzairways.com',
        'password123',
      );

      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(
        'test@uzairways.com',
      );
      expect(mockCryptoService.compare).toHaveBeenCalledWith(
        'password123',
        'hashedPassword123',
      );
      expect(result).toEqual({
        id: 1,
        email: 'test@uzairways.com',
        full_name: 'Test User',
        role: AdminRole.USER,
        is_active: true,
      });
    });

    it('should return null when user not found', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      const result = await service.validateUser(
        'notfound@uzairways.com',
        'password123',
      );

      expect(result).toBeNull();
      expect(mockCryptoService.compare).not.toHaveBeenCalled();
    });

    it('should return null when password is incorrect', async () => {
      const userResponse = { data: mockUser };
      mockUsersService.findByEmail.mockResolvedValue(userResponse);
      mockCryptoService.compare.mockResolvedValue(false);

      const result = await service.validateUser(
        'test@uzairways.com',
        'wrongpassword',
      );

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'test@uzairways.com',
      password: 'password123',
    };

    it('should return tokens and user data when login is successful', async () => {
      const userResponse = { data: mockUser };
      mockUsersService.findByEmail.mockResolvedValue(userResponse);
      mockCryptoService.compare.mockResolvedValue(true);
      mockJwtService.sign
        .mockReturnValueOnce('mock-access-token')
        .mockReturnValueOnce('mock-refresh-token');

      const result = await service.login(loginDto);

      expect(result).toEqual({
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        user: {
          id: 1,
          email: 'test@uzairways.com',
          full_name: 'Test User',
          role: AdminRole.USER,
          is_active: true,
        },
      });
      expect(mockJwtService.sign).toHaveBeenCalledTimes(2);
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockJwtService.sign).not.toHaveBeenCalled();
    });
  });

  describe('refreshToken', () => {
    it('should return new access token when refresh token is valid', async () => {
      const mockPayload = {
        email: 'test@uzairways.com',
        sub: 1,
        role: AdminRole.USER,
        full_name: 'Test User',
      };

      mockJwtService.verify.mockReturnValue(mockPayload);
      mockJwtService.sign.mockReturnValue('new-access-token');

      const result = await service.refreshToken('valid-refresh-token');

      expect(result).toEqual({ access_token: 'new-access-token' });
      expect(mockJwtService.verify).toHaveBeenCalledWith(
        'valid-refresh-token',
        expect.any(Object),
      );
    });

    it('should throw UnauthorizedException when refresh token is invalid', async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(service.refreshToken('invalid-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});

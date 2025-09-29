import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let jwtService: JwtService;
  let reflector: Reflector;

  const mockJwtService = {
    verifyAsync: jest.fn(),
  };

  const mockReflector = {
    getAllAndOverride: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: Reflector,
          useValue: mockReflector,
        },
      ],
    }).compile();

    guard = module.get<AuthGuard>(AuthGuard);
    jwtService = module.get<JwtService>(JwtService);
    reflector = module.get<Reflector>(Reflector);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    let mockContext: Partial<ExecutionContext>;
    let mockRequest: any;

    beforeEach(() => {
      mockRequest = {
        headers: {},
      };

      mockContext = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
          getResponse: () => ({}),
          getNext: () => ({}),
        }),
        getHandler: jest.fn(),
        getClass: jest.fn(),
      } as any;
    });

    it('should return true for public endpoints', async () => {
      mockReflector.getAllAndOverride.mockReturnValue(true);

      const result = await guard.canActivate(mockContext as ExecutionContext);

      expect(result).toBe(true);
      expect(mockJwtService.verifyAsync).not.toHaveBeenCalled();
    });

    it('should return true when valid token is provided', async () => {
      mockReflector.getAllAndOverride.mockReturnValue(false);
      mockRequest.headers.authorization = 'Bearer valid-token';

      const mockPayload = {
        sub: 1,
        email: 'test@uzairways.com',
        role: 'user',
      };

      mockJwtService.verifyAsync.mockResolvedValue(mockPayload);

      const result = await guard.canActivate(mockContext as ExecutionContext);

      expect(result).toBe(true);
      expect(mockRequest.user).toEqual(mockPayload);
      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(
        'valid-token',
        expect.any(Object),
      );
    });

    it('should throw UnauthorizedException when no token is provided', async () => {
      mockReflector.getAllAndOverride.mockReturnValue(false);

      await expect(
        guard.canActivate(mockContext as ExecutionContext),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when token is invalid', async () => {
      mockReflector.getAllAndOverride.mockReturnValue(false);
      mockRequest.headers.authorization = 'Bearer invalid-token';
      mockJwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));

      await expect(
        guard.canActivate(mockContext as ExecutionContext),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when authorization header format is wrong', async () => {
      mockReflector.getAllAndOverride.mockReturnValue(false);
      mockRequest.headers.authorization = 'InvalidFormat token';

      await expect(
        guard.canActivate(mockContext as ExecutionContext),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});

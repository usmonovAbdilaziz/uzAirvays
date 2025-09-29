import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { RolesGuard } from './roles.guard';
import { AdminRole } from '../Roles/roles';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  const mockReflector = {
    getAllAndOverride: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: mockReflector,
        },
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
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
      mockRequest = {};

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

    it('should return true when no roles are required', () => {
      mockReflector.getAllAndOverride.mockReturnValue(undefined);

      const result = guard.canActivate(mockContext as ExecutionContext);

      expect(result).toBe(true);
    });

    it('should return true for SUPERADMIN regardless of required roles', () => {
      mockReflector.getAllAndOverride.mockReturnValue([AdminRole.ADMIN]);
      mockRequest.user = { role: AdminRole.SUPERADMIN };

      const result = guard.canActivate(mockContext as ExecutionContext);

      expect(result).toBe(true);
    });

    it('should return true when user has required role', () => {
      mockReflector.getAllAndOverride.mockReturnValue([
        AdminRole.ADMIN,
        AdminRole.USER,
      ]);
      mockRequest.user = { role: AdminRole.ADMIN };

      const result = guard.canActivate(mockContext as ExecutionContext);

      expect(result).toBe(true);
    });

    it('should throw ForbiddenException when user does not have required role', () => {
      mockReflector.getAllAndOverride.mockReturnValue([AdminRole.ADMIN]);
      mockRequest.user = { role: AdminRole.USER };

      expect(() => guard.canActivate(mockContext as ExecutionContext)).toThrow(
        ForbiddenException,
      );
    });

    it('should throw ForbiddenException when user is not found', () => {
      mockReflector.getAllAndOverride.mockReturnValue([AdminRole.USER]);
      mockRequest.user = undefined;

      expect(() => guard.canActivate(mockContext as ExecutionContext)).toThrow(
        ForbiddenException,
      );
    });

    it('should handle multiple required roles correctly', () => {
      mockReflector.getAllAndOverride.mockReturnValue([
        AdminRole.ADMIN,
        AdminRole.SUPERADMIN,
      ]);
      mockRequest.user = { role: AdminRole.ADMIN };

      const result = guard.canActivate(mockContext as ExecutionContext);

      expect(result).toBe(true);
    });
  });
});

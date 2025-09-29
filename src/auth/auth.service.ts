import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { CryptoService } from '../utils/hashed-password';
import { jwtConstants } from './constants';
import { handleError } from 'src/helps/http-filter.response';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly cryptoService: CryptoService,
  ) {}

  private generateTokens(payload: any) {
    const accessToken = this.jwtService.sign(payload, {
      secret: jwtConstants.secret,
      expiresIn: jwtConstants.expiresIn,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: jwtConstants.refreshSecret,
      expiresIn: jwtConstants.refreshExpiresIn,
    });

    return { accessToken, refreshToken };
  }

  async validateUser(email: string, password: string): Promise<any | null> {
    try {
      const userResponse = await this.usersService.findByEmail(email);
      if (!userResponse) {
        return null;
      }

      const user = userResponse.data as any;
      const isPasswordValid = await this.cryptoService.compare(
        password,
        user.dataValues?.password || user.password,
      );

      if (isPasswordValid) {
        const { password: userPassword, ...result } = user.dataValues || user;
        return result;
      }
      return null;
    } catch (error) {
      handleError(error);
      return null;
    }
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ access_token: string; refresh_token: string; user: any }> {
    try {
      const { email, password } = loginDto;
      const user = await this.validateUser(email, password);

      if (!user) {
        throw new UnauthorizedException("Email yoki parol noto'g'ri");
      }

      const payload = {
        email: user.email,
        sub: user.id,
        role: user.role,
        full_name: user.full_name,
      };

      const { accessToken, refreshToken } = this.generateTokens(payload);

      return {
        access_token: accessToken,
        refresh_token: refreshToken,
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
          is_active: user.is_active,
        },
      };
    } catch (error) {
      handleError(error);
      throw new UnauthorizedException('Login xatoligi');
    }
  }

  async refreshToken(token: string): Promise<{ access_token: string }> {
    try {
      const payload = this.jwtService.verify(token, {
        secret: jwtConstants.refreshSecret,
      });

      const newPayload = {
        email: payload.email,
        sub: payload.sub,
        role: payload.role,
        full_name: payload.full_name,
      };

      const { accessToken } = this.generateTokens(newPayload);

      return { access_token: accessToken };
    } catch (error) {
      throw new UnauthorizedException("Token noto'g'ri yoki muddati tugagan");
    }
  }
}

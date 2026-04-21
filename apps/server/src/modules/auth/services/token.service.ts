import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

type AccessTokenPayload = {
  sub: string;
  email: string;
  role: string;
};

type RefreshTokenPayload = {
  sub: string;
  email: string;
};

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateAccessToken(payload: AccessTokenPayload) {
    const secret = this.configService.get<string>('JWT_ACCESS_SECRET');
    return this.jwtService.sign(payload, {
      secret,
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    } as any);
  }

  async generateRefreshToken(payload: RefreshTokenPayload) {
    const secret = this.configService.get<string>('JWT_REFRESH_SECRET');
    return this.jwtService.sign(payload, {
      secret,
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    } as any);
  }

  async generateAuthTokens(user: { id: string; email: string; role: string }) {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken({
        sub: user.id,
        email: user.email,
        role: user.role,
      }),
      this.generateRefreshToken({
        sub: user.id,
        email: user.email,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async verifyRefreshToken(token: string): Promise<RefreshTokenPayload> {
    const secret = this.configService.get<string>('JWT_REFRESH_SECRET');

    if (!secret) {
      throw new UnauthorizedException('JWT_REFRESH_SECRET not configured');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret,
      });

      if (!payload.sub || !payload.email) {
        throw new UnauthorizedException('Invalid refresh token payload');
      }

      return {
        sub: payload.sub,
        email: payload.email,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}

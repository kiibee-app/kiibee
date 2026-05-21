import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenDenylistService } from '../services/token-denylist.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    private readonly tokenDenylistService: TokenDenylistService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
    });
  }

  async validate(payload: {
    sub: string;
    email: string;
    role: string;
    jti?: string;
  }) {
    if (!payload?.sub) {
      throw new UnauthorizedException('Invalid access token');
    }

    if (payload.jti) {
      const revoked = await this.tokenDenylistService.isRevoked(payload.jti);
      if (revoked) {
        throw new UnauthorizedException('Token has been revoked');
      }
    }

    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}

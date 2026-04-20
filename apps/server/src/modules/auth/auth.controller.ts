import {
  Body,
  Controller,
  Post,
  Req,
  Headers,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ViewerSignUpDto } from './dto/viewerSignUp.dto';
import { LoginDto } from './dto/login.dto';
import { TokenService } from './services/token.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}

  @Post('signup')
  async viewerSignUp(@Body() dto: ViewerSignUpDto, @Req() req: any) {
    const result = await this.authService.viewerSignUp(dto);

    if (result.success && result.data) {
      const tokens = await this.tokenService.generateAuthTokens({
        id: result.data.id,
        email: result.data.email,
        role: result.data.role,
      });

      const ipAddress = req.ip || req.connection?.remoteAddress;
      const userAgent = req.headers['user-agent'];

      await this.authService.createSession(
        result.data.id,
        tokens.refreshToken,
        ipAddress,
        userAgent,
      );

      return {
        ...result,
        data: {
          ...result.data,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
      };
    }

    return result;
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Req() req: any) {
    const result = await this.authService.login(dto);

    if (result.success && result.data) {
      const tokens = await this.tokenService.generateAuthTokens({
        id: result.data.id,
        email: result.data.email,
        role: result.data.role,
      });

      const ipAddress = req.ip || req.connection?.remoteAddress;
      const userAgent = req.headers['user-agent'];

      await this.authService.createSession(
        result.data.id,
        tokens.refreshToken,
        ipAddress,
        userAgent,
      );

      return {
        ...result,
        data: {
          ...result.data,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
      };
    }

    return result;
  }

  @Post('refresh')
  async refresh(@Headers('authorization') authorization: string) {
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Authorization header missing or invalid',
      );
    }

    const refreshToken = authorization.replace('Bearer ', '');

    try {
      const payload = await this.tokenService.verifyRefreshToken(refreshToken);
      const result = await this.authService.refresh({
        userId: payload.sub,
        email: payload.email,
      });
      return result;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: any) {
    const result = await this.authService.logout(req.user.userId);
    return result;
  }
}

import {
  Body,
  Controller,
  Post,
  Get,
  Req,
  Headers,
  UnauthorizedException,
  UseGuards,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ViewerSignUpDto } from './dto/viewerSignUp.dto';
import { LoginDto } from './dto/login.dto';
import { TokenService } from './services/token.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { CreatorAccountSetupDto } from './dto/creatorAccountSetup.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';

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
        refreshToken,
      });
      return result;
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: any) {
    const result = await this.authService.logout(req.user.userId);
    return result;
  }

  @Post('creator-request')
  async creatorRequest(@Body() payload: any) {
    const result = await this.authService.creatorRequest(payload);
    return result;
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('all-creator-requests')
  async getCreatorRequests() {
    const result = await this.authService.getCreatorRequests();
    return result;
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('approve-creator')
  async approveCreatorRequest(
    @Body() body: { requestId: string },
    @Req() req: any,
  ) {
    const approverUserId = req.user.userId;
    const result = await this.authService.approveCreatorRequest(
      body.requestId,
      approverUserId,
    );
    return result;
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('reject-creator')
  async rejectCreatorRequest(
    @Body() body: { requestId: string },
    @Req() req: any,
  ) {
    const approverUserId = req.user.userId;
    const result = await this.authService.rejectCreatorRequest(
      body.requestId,
      approverUserId,
    );
    return result;
  }

  @Get('validate-token/:token')
  async validateToken(@Param('token') token: string) {
    const result = await this.authService.validateToken(token);
    return result;
  }

  @Post('creator/setup')
  async setupCreatorAccount(@Body() payload: CreatorAccountSetupDto) {
    const result = await this.authService.setupCreatorAccount(payload);
    return result;
  }

  @Post('forget-password')
  async forgetPassword(@Body('email') email: string) {
    const result = await this.authService.forgetPassword(email);
    return result;
  }
  @Post('reset-password')
  async resetPassword(@Body() payload: ResetPasswordDto) {
    const result = await this.authService.resetPassword(payload);
    return result;
  }
}

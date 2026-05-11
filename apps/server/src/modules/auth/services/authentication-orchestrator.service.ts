import { Injectable } from '@nestjs/common';
import { TokenService } from './token.service';
import { AuthService } from '../auth.service';
import { ApiSuccessResponse } from 'src/utils/sendResponse';

export interface UserData {
  id: string;
  email: string;
  role: string;
  fullName?: string | null;
  isEmailVerified?: boolean;
  createdAt?: string | Date;
}

@Injectable()
export class AuthenticationOrchestrator {
  constructor(
    private readonly tokenService: TokenService,
    private readonly authService: AuthService,
  ) {}

  async completeLogin(
    user: UserData,
    req: any,
  ): Promise<
    ApiSuccessResponse<UserData & { accessToken: string; refreshToken: string }>
  > {
    const tokens = await this.tokenService.generateAuthTokens({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const ipAddress = req.ip || req.connection?.remoteAddress;
    const userAgent = req.headers['user-agent'];

    await this.authService.createSession(
      user.id,
      tokens.refreshToken,
      ipAddress,
      userAgent,
    );

    return {
      success: true,
      statusCode: 200,
      message: 'Login successful',
      data: {
        ...user,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    };
  }
}

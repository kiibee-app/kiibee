import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { viewerSignUpService } from './services/viewerSignUp.service';
import { loginService } from './services/login.service';
import { logoutService, invalidateSession } from './services/logout.service';
import { TokenService } from './services/token.service';
import { eq } from 'drizzle-orm';
import { db } from 'src/database/db';
import { users } from 'src/database/schema';
import { success, fail } from 'src/utils/sendResponse';
import { ViewerSignUpDto } from './dto/viewerSignUp.dto';
import { creatorRequestService } from './services/creatorRequest.service';
import { approveCreatorRequestService } from './services/approvCreatorRequest.service';
import { getCreatorRequestService } from './services/getCreatorRequest.service';
import { rejectCreatorRequestService } from './services/rejectCreatorRequest.service';
import { validateTokenService } from './services/validateToken.service';
import { setupCreatorAccountService } from './services/creatorAccountSetup.service';
import { CreatorAccountSetupDto } from './dto/creatorAccountSetup.dto';
import { forgetPasswordService } from './services/forgetPassword.service';
import { resetPasswordService } from './services/resetPassword.service';

@Injectable()
export class AuthService {
  constructor(private readonly tokenService: TokenService) {}

  async viewerSignUp(viewerData: ViewerSignUpDto) {
    return viewerSignUpService(viewerData);
  }

  async login(loginData: LoginDto) {
    return loginService(loginData, '', undefined, undefined);
  }

  async refresh(userFromToken: { userId: string; email: string }) {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userFromToken.userId),
      columns: {
        role: true,
      },
    });

    if (!user) {
      return fail('User not found', 404);
    }

    const tokens = await this.tokenService.generateAuthTokens({
      id: userFromToken.userId,
      email: userFromToken.email,
      role: user.role,
    });

    return success(
      {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
      'Tokens refreshed successfully',
      200,
    );
  }

  async logout(userId: string) {
    return invalidateSession(userId);
  }

  async createSession(
    userId: string,
    refreshToken: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    return logoutService(userId, refreshToken, ipAddress, userAgent);
  }

  async creatorRequest(payload: any) {
    return creatorRequestService(payload);
  }
  async getCreatorRequests() {
    return getCreatorRequestService();
  }
  async approveCreatorRequest(requestId: string, approverUserId: string) {
    return approveCreatorRequestService(requestId, approverUserId);
  }
  async rejectCreatorRequest(requestId: string, approverUserId: string) {
    return rejectCreatorRequestService(requestId, approverUserId);
  }
  async validateToken(token: string) {
    return validateTokenService(token);
  }
  async setupCreatorAccount(payload: CreatorAccountSetupDto) {
    return setupCreatorAccountService(payload);
  }
  async forgetPassword(email: string) {
    return forgetPasswordService(email);
  }
  async resetPassword(payload: any) {
    return resetPasswordService(payload);
  }
}

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import { viewerSignUpService } from './services/viewerSignUp.service';
import { loginService } from './services/login.service';
import { invalidateSession } from './services/logout.service';
import { TokenService } from './services/token.service';
import { and, eq, gt } from 'drizzle-orm';
import { db } from 'src/database/db';
import { users, userSessions } from 'src/database/schema';
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
import * as bcrypt from 'bcrypt';
import { createSessionService } from './services/createSession.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
  ) {}

  async viewerSignUp(viewerData: ViewerSignUpDto) {
    return viewerSignUpService(viewerData);
  }

  async login(loginData: LoginDto) {
    return loginService(loginData, '', undefined, undefined);
  }

  async refresh(
    userFromToken: { userId: string; email: string },
    refreshToken: string,
  ) {
    return db.transaction(async (tx) => {
      const user = await tx.query.users.findFirst({
        where: and(
          eq(users.id, userFromToken.userId),
          eq(users.isDeleted, false),
        ),
        columns: {
          role: true,
        },
      });

      if (!user) {
        return fail('User not found', 404);
      }

      const session = await tx.query.userSessions.findFirst({
        where: and(
          eq(userSessions.userId, userFromToken.userId),
          gt(userSessions.expiresAt, new Date()),
        ),
        columns: {
          refreshTokenHash: true,
          expiresAt: true,
          id: true,
        },
      });

      if (!session) {
        return fail('Refresh session not found or expired', 401);
      }

      const isRefreshTokenValid = await bcrypt.compare(
        refreshToken,
        session.refreshTokenHash,
      );

      if (!isRefreshTokenValid) {
        return fail('Refresh token has been revoked', 401);
      }

      const tokens = await this.tokenService.generateAuthTokens({
        id: userFromToken.userId,
        email: userFromToken.email,
        role: user.role,
      });
      const nextRefreshTokenHash = await bcrypt.hash(tokens.refreshToken, 12);
      const nextExpiresAt = new Date();
      nextExpiresAt.setDate(nextExpiresAt.getDate() + 7);

      const updatedSession = await tx
        .update(userSessions)
        .set({
          refreshTokenHash: nextRefreshTokenHash,
          expiresAt: nextExpiresAt,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(userSessions.userId, userFromToken.userId),
            eq(userSessions.refreshTokenHash, session.refreshTokenHash),
          ),
        )
        .returning({ id: userSessions.id });

      if (updatedSession.length === 0) {
        return fail(
          'Refresh token was already rotated. Please login again',
          401,
        );
      }

      return success(
        {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
        'Tokens refreshed successfully',
        200,
      );
    });
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
    return createSessionService(userId, refreshToken, ipAddress, userAgent);
  }

  async creatorRequest(payload: any) {
    return creatorRequestService(payload);
  }
  async getCreatorRequests() {
    return getCreatorRequestService();
  }
  async approveCreatorRequest(requestId: string, approverUserId: string) {
    const frontendBaseUrl =
      this.configService.getOrThrow<string>('FRONTEND_URL');
    return approveCreatorRequestService(
      requestId,
      approverUserId,
      frontendBaseUrl,
    );
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
    const frontendBaseUrl =
      this.configService.getOrThrow<string>('FRONTEND_URL');
    return forgetPasswordService(email, frontendBaseUrl);
  }
  async resetPassword(payload: any) {
    return resetPasswordService(payload);
  }
}

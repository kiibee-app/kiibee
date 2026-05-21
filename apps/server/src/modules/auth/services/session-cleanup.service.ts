import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { db } from 'src/database/db';
import { userSessions } from 'src/database/schema';
import { lt } from 'drizzle-orm';
import { TokenDenylistService } from './token-denylist.service';

@Injectable()
export class SessionCleanupService {
  private readonly logger = new Logger(SessionCleanupService.name);

  constructor(private readonly tokenDenylistService: TokenDenylistService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async cleanupExpiredSessions() {
    try {
      const result = await db
        .delete(userSessions)
        .where(lt(userSessions.expiresAt, new Date()))
        .returning({ id: userSessions.id });

      if (result.length > 0) {
        this.logger.log(`Cleaned up ${result.length} expired sessions`);
      }

      await this.tokenDenylistService.cleanupExpired();
    } catch (error) {
      this.logger.error('Failed to cleanup expired sessions or tokens', error);
    }
  }
}

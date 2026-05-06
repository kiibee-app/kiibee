import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { db } from 'src/database/db';
import { userSessions } from 'src/database/schema';
import { lt } from 'drizzle-orm';

@Injectable()
export class SessionCleanupService {
  private readonly logger = new Logger(SessionCleanupService.name);

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
    } catch (error) {
      this.logger.error('Failed to cleanup expired sessions', error);
    }
  }
}

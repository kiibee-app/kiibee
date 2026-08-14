import { randomUUID } from 'crypto';
import { eq, desc } from 'drizzle-orm';
import { db } from 'src/database/db';
import { auditLogs } from 'src/database/schema';
import { logger } from 'src/logger/logger';

export interface AuditLogData {
  userId: string | null;
  action: string;
  resource: string;
  resourceId?: string;
  ipAddress?: string;
  userAgent?: string;
  changes?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export async function logAudit(data: AuditLogData): Promise<void> {
  try {
    await db.insert(auditLogs).values({
      id: randomUUID(),
      userId: data.userId,
      action: data.action,
      entityType: data.resource,
      entityId: data.resourceId,
      ipAddress: data.ipAddress,
      details: {
        changes: data.changes ?? null,
        metadata: data.metadata ?? null,
      },
    });
  } catch (error) {
    logger.error('Failed to write audit log', error);
  }
}

export async function getAuditTrail(
  userId: string,
  options: {
    limit: number;
    offset: number;
  },
) {
  return db
    .select()
    .from(auditLogs)
    .where(eq(auditLogs.userId, userId))
    .orderBy(desc(auditLogs.createdAt))
    .limit(options.limit)
    .offset(options.offset);
}

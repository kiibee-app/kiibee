import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { eq, lt } from 'drizzle-orm';
import { db } from 'src/database/db';
import { revokedTokens } from 'src/database/schema';

@Injectable()
export class TokenDenylistService {
  async revoke(jti: string, exp: number): Promise<void> {
    if (!jti) return;
    const expiresAt = new Date(exp * 1000);
    try {
      await db.insert(revokedTokens).values({
        id: randomUUID(),
        jti,
        expiresAt,
      });
    } catch {
      await db
        .update(revokedTokens)
        .set({ expiresAt })
        .where(eq(revokedTokens.jti, jti));
    }
  }

  async isRevoked(jti: string): Promise<boolean> {
    if (!jti) return false;
    const record = await db.query.revokedTokens.findFirst({
      where: eq(revokedTokens.jti, jti),
      columns: { id: true },
    });
    return !!record;
  }

  async cleanupExpired(): Promise<void> {
    const now = new Date();
    await db.delete(revokedTokens).where(lt(revokedTokens.expiresAt, now));
  }
}

export const revokeAccessToken = async (jti: string, expiresAt: Date) => {
  if (!jti) return;
  try {
    await db.insert(revokedTokens).values({
      id: randomUUID(),
      jti,
      expiresAt,
    });
  } catch {
    await db
      .update(revokedTokens)
      .set({ expiresAt })
      .where(eq(revokedTokens.jti, jti));
  }
};

export const isAccessTokenRevoked = async (jti: string): Promise<boolean> => {
  if (!jti) return false;
  const record = await db.query.revokedTokens.findFirst({
    where: eq(revokedTokens.jti, jti),
    columns: { id: true },
  });
  return !!record;
};

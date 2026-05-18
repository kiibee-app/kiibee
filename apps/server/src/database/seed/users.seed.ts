import { db } from '../db';
import { users } from '../schema/users/users.schema';
import { hashPassword } from 'src/utils/passwordHash';

export const seedUsers = async () => {
  const adminEmail = process.env.SEED_ADMIN_EMAIL?.trim();
  const viewerEmail = process.env.SEED_VIEWER_EMAIL?.trim();
  const seedPassword = process.env.SEED_USER_PASSWORD;

  if (!adminEmail || !viewerEmail || !seedPassword) {
    throw new Error(
      'Missing seed user credentials. Set SEED_ADMIN_EMAIL, SEED_VIEWER_EMAIL, and SEED_USER_PASSWORD.',
    );
  }

  const passwordHash = await hashPassword(seedPassword);

  await db
    .insert(users)
    .values([
      {
        id: crypto.randomUUID(),
        email: adminEmail,
        passwordHash,
        role: 'admin',
        status: 'active',
        isEmailVerified: true,
        isActive: true,
      },
      {
        id: crypto.randomUUID(),
        email: viewerEmail,
        passwordHash,
        role: 'viewer',
        status: 'active',
        isEmailVerified: true,
        isActive: true,
      },
    ])
    .onConflictDoNothing();
};

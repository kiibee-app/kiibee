import { db } from '../db';
import { users } from '../schema/users/users.schema';
import { hashPassword } from 'src/utils/passwordHash';

export const seedUsers = async () => {
  const passwordHash = await hashPassword('1234');

  await db
    .insert(users)
    .values([
      {
        id: crypto.randomUUID(),
        email: 'admin@gmail.com',
        passwordHash,
        role: 'admin',
        status: 'active',
        isEmailVerified: true,
        isActive: true,
      },
      {
        id: crypto.randomUUID(),
        email: 'user@gmail.com',
        passwordHash,
        role: 'viewer',
        status: 'active',
        isEmailVerified: true,
        isActive: true,
      },
    ])
    .onConflictDoNothing();
};

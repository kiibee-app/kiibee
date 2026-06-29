import { db } from '../db';
import { users } from '../schema/users/users.schema';
import { hashPassword } from 'src/utils/passwordHash';
import { deterministicUuid } from './umbracoSeed.helpers';

const BASE_USERS = [
  {
    id: deterministicUuid('seed:user:admin@gmail.com'),
    email: 'admin@gmail.com',
    fullName: 'Admin',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin' as const,
  },
  {
    id: deterministicUuid('seed:user:user@gmail.com'),
    email: 'user@gmail.com',
    fullName: 'Demo Viewer',
    firstName: 'Demo',
    lastName: 'Viewer',
    role: 'viewer' as const,
  },
];

export const seedUsers = async () => {
  const passwordHash = await hashPassword('1234');
  const now = new Date();

  for (const user of BASE_USERS) {
    await db
      .insert(users)
      .values({
        id: user.id,
        email: user.email,
        passwordHash,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        role: user.role,
        status: 'active',
        isEmailVerified: true,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: users.email,
        set: {
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.fullName,
          role: user.role,
          status: 'active',
          isEmailVerified: true,
          isActive: true,
          updatedAt: now,
        },
      });
  }

  console.log(
    `Base users seeded successfully (${BASE_USERS.length} admin/viewer accounts)`,
  );
};

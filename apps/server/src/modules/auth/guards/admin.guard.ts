import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Type,
  mixin,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { eq } from 'drizzle-orm';

import { db } from 'src/database/db';
import { users } from 'src/database/schema';
import { ROLE } from 'src/utils/constant';

type RoleValue = (typeof ROLE)[keyof typeof ROLE];

const createRoleGuard = (role: RoleValue): Type => {
  @Injectable()
  class RoleGuard extends AuthGuard('jwt') {
    async canActivate(context: ExecutionContext): Promise<boolean> {
      await super.canActivate(context);

      const request = context.switchToHttp().getRequest();
      const { user } = request;

      const dbUser = await db.query.users.findFirst({
        where: eq(users.id, user.userId),
        columns: {
          role: true,
        },
      });

      if (!dbUser || dbUser.role !== role) {
        throw new ForbiddenException(
          `Only ${role.toLowerCase()}s can access this resource`,
        );
      }

      return true;
    }
  }

  return mixin(RoleGuard);
};

export const AdminGuard = createRoleGuard(ROLE.ADMIN);
export const CreatorGuard = createRoleGuard(ROLE.CREATOR);

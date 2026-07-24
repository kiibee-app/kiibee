import { Injectable, ForbiddenException } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ROLE } from 'src/utils/constant';
import { db } from 'src/database/db';
import { users } from 'src/database/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class AdminGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext) {
    await super.canActivate(context);
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const dbUser = await db.query.users.findFirst({
      where: eq(users.id, user.userId),
      columns: { role: true },
    });

    if (!dbUser || dbUser.role !== ROLE.ADMIN) {
      throw new ForbiddenException('Only admins can access this resource');
    }
    return true;
  }
}

@Injectable()
export class CreatorGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext) {
    await super.canActivate(context);
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const dbUser = await db.query.users.findFirst({
      where: eq(users.id, user.userId),
      columns: { role: true },
    });

    if (!dbUser || dbUser.role !== ROLE.CREATOR) {
      throw new ForbiddenException('Only creators can access this resource');
    }
    return true;
  }
}

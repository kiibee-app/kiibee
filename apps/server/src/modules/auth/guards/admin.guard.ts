import { Injectable, ForbiddenException } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ROLE } from 'src/utils/constant';

@Injectable()
export class AdminGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any) {
    if (!user || user.role !== ROLE.ADMIN) {
      throw new ForbiddenException('Only admins can access this resource');
    }
    return user;
  }
}

@Injectable()
export class CreatorGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any) {
    console.log('CreatorGuard: user role:', user?.role);
    if (!user || user.role !== ROLE.CREATOR) {
      throw new ForbiddenException('Only creators can access this resource');
    }
    return user;
  }
}

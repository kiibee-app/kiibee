import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Public reads use a verified identity when present; anonymous reads stay public.
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = any>(_error: unknown, user: TUser): TUser {
    return user || (null as TUser);
  }
}

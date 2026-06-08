import { Controller, Delete, Get, Param, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatorGuard } from '../auth/guards/admin.guard';
import { CreatorUsersService } from './creator-users.service';

type AuthenticatedRequest = Request & {
  user: {
    userId: string;
    role: string;
  };
};

@Controller('creator-users')
export class CreatorUsersController {
  constructor(private readonly creatorUsersService: CreatorUsersService) {}

  @UseGuards(JwtAuthGuard, CreatorGuard)
  @Get('registrations')
  getRegistrations(@Req() req: AuthenticatedRequest) {
    return this.creatorUsersService.getRegistrations(req.user.userId);
  }

  @UseGuards(JwtAuthGuard, CreatorGuard)
  @Get('sales')
  getSales(@Req() req: AuthenticatedRequest) {
    return this.creatorUsersService.getSales(req.user.userId);
  }

  @UseGuards(JwtAuthGuard, CreatorGuard)
  @Delete('registrations/:id')
  deleteRegistration(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    return this.creatorUsersService.deleteRegistration(req.user.userId, id);
  }
}

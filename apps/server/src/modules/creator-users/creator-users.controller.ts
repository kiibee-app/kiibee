import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatorGuard } from '../auth/guards/admin.guard';
import { CreatorUsersService } from './creator-users.service';

@Controller('creator-users')
export class CreatorUsersController {
  constructor(private readonly creatorUsersService: CreatorUsersService) {}

  @UseGuards(JwtAuthGuard, CreatorGuard)
  @Get('registrations')
  getRegistrations() {
    return this.creatorUsersService.getRegistrations();
  }

  @UseGuards(JwtAuthGuard, CreatorGuard)
  @Get('sales')
  getSales() {
    return this.creatorUsersService.getSales();
  }

  @UseGuards(JwtAuthGuard, CreatorGuard)
  @Delete('registrations/:id')
  deleteRegistration(@Param('id') id: string) {
    return this.creatorUsersService.deleteRegistration(id);
  }
}

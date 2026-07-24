import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatorGuard } from '../auth/guards/admin.guard';
import { CreatorUsersService } from './creator-users.service';
import type { RegisterEmailDto } from './services/registerEmail.service';
import {
  ApproveContentAccessDto,
  RequestContentAccessDto,
} from './dto/contentAccess.dto';

type AuthenticatedRequest = Request & {
  user: {
    userId: string;
    role: string;
  };
};

@Controller('creator-users')
export class CreatorUsersController {
  constructor(private readonly creatorUsersService: CreatorUsersService) {}

  @Post('register')
  registerEmail(@Body() body: RegisterEmailDto) {
    return this.creatorUsersService.registerEmail(body);
  }

  @Post('content-access/request')
  requestContentAccess(@Body() body: RequestContentAccessDto) {
    return this.creatorUsersService.requestContentAccess(body);
  }

  @Get('content-access/approve')
  approveContentAccess(@Query() query: ApproveContentAccessDto) {
    return this.creatorUsersService.approveContentAccess(query.token);
  }

  @UseGuards(JwtAuthGuard)
  @Post('content-access/redeem')
  redeemContentAccess(
    @Req() req: AuthenticatedRequest,
    @Body() body: ApproveContentAccessDto,
  ) {
    return this.creatorUsersService.redeemContentAccess(
      body.token,
      req.user.userId,
    );
  }

  @UseGuards(JwtAuthGuard, CreatorGuard)
  @Get('registrations')
  getRegistrations(@Req() req: AuthenticatedRequest) {
    return this.creatorUsersService.getRegistrations(req.user.userId);
  }

  @UseGuards(JwtAuthGuard, CreatorGuard)
  @Get('sales')
  getSales(
    @Req() req: AuthenticatedRequest,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.creatorUsersService.getSales(req.user.userId, {
      search: search?.trim() || undefined,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
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

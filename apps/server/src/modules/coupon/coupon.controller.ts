import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatorGuard } from '../auth/guards/admin.guard';
import { CouponService } from './coupon.service';

type AuthenticatedRequest = Request & {
  user: {
    userId: string;
    role: string;
  };
};

@Controller('coupons')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @UseGuards(JwtAuthGuard, CreatorGuard)
  @Get()
  async getCoupons(@Req() req: AuthenticatedRequest) {
    return this.couponService.getCoupons(req.user.userId);
  }

  @UseGuards(JwtAuthGuard, CreatorGuard)
  @Post('create')
  async createCoupon(
    @Req() req: AuthenticatedRequest,
    @Body() payload: Record<string, unknown>,
  ) {
    return this.couponService.createCoupon(req.user.userId, payload);
  }

  @UseGuards(JwtAuthGuard, CreatorGuard)
  @Patch(':id')
  async updateCoupon(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() payload: Record<string, unknown>,
  ) {
    return this.couponService.updateCoupon(req.user.userId, id, payload);
  }

  @UseGuards(JwtAuthGuard, CreatorGuard)
  @Delete(':id')
  async deleteCoupon(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    return this.couponService.deleteCoupon(req.user.userId, id);
  }
}

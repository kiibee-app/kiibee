import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
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
}

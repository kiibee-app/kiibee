import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard, CreatorGuard } from '../auth/guards/admin.guard';
import type { AdminContentCouponPayload } from './services/createAdminContentCoupon.service';
import { CouponService } from './coupon.service';

import {
  editAdminContentCoupon,
  listAdminContentCoupons,
  removeAdminContentCoupon,
} from './services/manageAdminContentCoupons.service';

type AuthenticatedRequest = Request & {
  user: {
    userId: string;
    role: string;
  };
};

@Controller('coupons')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('admin/content/:contentId')
  async createContentCoupon(
    @Req() req: AuthenticatedRequest,
    @Param('contentId') contentId: string,
    @Body() payload: AdminContentCouponPayload,
  ) {
    return this.couponService.createAdminContentCoupon(
      req.user.userId,
      contentId,
      payload,
    );
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('admin/content/:contentId')
  listContentCoupons(@Param('contentId') contentId: string) {
    return listAdminContentCoupons(contentId);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch('admin/content/:contentId/:couponId')
  editContentCoupon(
    @Param('contentId') contentId: string,
    @Param('couponId') couponId: string,
    @Body() payload: AdminContentCouponPayload,
  ) {
    return editAdminContentCoupon(contentId, couponId, payload);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete('admin/content/:contentId/:couponId')
  removeContentCoupon(
    @Param('contentId') contentId: string,
    @Param('couponId') couponId: string,
  ) {
    return removeAdminContentCoupon(contentId, couponId);
  }

  @UseGuards(JwtAuthGuard, CreatorGuard)
  @Get()
  async getCoupons(@Req() req: AuthenticatedRequest) {
    return this.couponService.getCoupons(req.user.userId);
  }

  @UseGuards(JwtAuthGuard, CreatorGuard)
  @Get(':id')
  async getCouponById(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    return this.couponService.getCouponById(req.user.userId, id);
  }

  @Post('verify')
  async verifyCoupon(
    @Body() body: { code: string; contentId?: string; collectionId?: string },
  ) {
    return this.couponService.verifyCoupon(
      body.code,
      body.contentId,
      body.collectionId,
    );
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
  @Put(':id')
  async replaceCoupon(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() payload: Record<string, unknown>,
  ) {
    return this.couponService.replaceCoupon(req.user.userId, id, payload);
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

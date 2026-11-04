import { Injectable } from '@nestjs/common';
import {
  createAdminContentCouponService,
  type AdminContentCouponPayload,
} from './services/createAdminContentCoupon.service';
import { createCouponService } from './services/createCoupon.service';
import { deleteCouponService } from './services/deleteCoupon.service';
import { getCouponByIdService } from './services/getCouponById.service';
import { getCouponsService } from './services/getCoupons.service';
import { updateCouponService } from './services/updateCoupon.service';
import { verifyCouponService } from './services/verifyCoupon.service';

type CreateCouponPayload = {
  title?: string;
  discountType?: string;
  discountValue?: string | number;
  currency?: string;
  status?: string;
  validFrom?: string;
  validUntil?: string;
  maxUses?: number;
  codes?: string[];
  collectionId?: string;
  contentId?: string;
};

@Injectable()
export class CouponService {
  async createAdminContentCoupon(
    adminId: string,
    contentId: string,
    payload: AdminContentCouponPayload,
  ) {
    return createAdminContentCouponService(adminId, contentId, payload);
  }

  async createCoupon(creatorId: string, payload: CreateCouponPayload) {
    return createCouponService(creatorId, payload);
  }

  async getCoupons(creatorId: string) {
    return getCouponsService(creatorId);
  }

  async getCouponById(creatorId: string, couponId: string) {
    return getCouponByIdService(creatorId, couponId);
  }

  async updateCoupon(
    creatorId: string,
    couponId: string,
    payload: CreateCouponPayload,
  ) {
    return updateCouponService(creatorId, couponId, payload);
  }

  async replaceCoupon(
    creatorId: string,
    couponId: string,
    payload: CreateCouponPayload,
  ) {
    return updateCouponService(creatorId, couponId, payload);
  }

  async deleteCoupon(creatorId: string, couponId: string) {
    return deleteCouponService(creatorId, couponId);
  }

  async verifyCoupon(code: string, contentId?: string, collectionId?: string) {
    return verifyCouponService(code, contentId, collectionId);
  }
}

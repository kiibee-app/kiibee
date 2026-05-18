import { Injectable } from '@nestjs/common';
import { createCouponService } from './services/createCoupon.service';
import { getCouponsService } from './services/getCoupons.service';

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
  async createCoupon(creatorId: string, payload: CreateCouponPayload) {
    return createCouponService(creatorId, payload);
  }

  async getCoupons(creatorId: string) {
    return getCouponsService(creatorId);
  }
}

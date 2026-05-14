import { pgEnum } from 'drizzle-orm/pg-core';

// Content
export const mediaFileTypeEnum = pgEnum('media_file_type', [
  'video',
  'audio',
  'pdf',
  'epub',
  'web',
]);

export const visibilityEnum = pgEnum('visibility', [
  'public',
  'hidden',
  'draft',
]);

export const accessTypeEnum = pgEnum('access_type', [
  'free',
  'paid',
  'password',
  'email_gated',
]);

// Commerce
export const orderStatusEnum = pgEnum('order_status', [
  'pending',
  'completed',
  'failed',
  'refunded',
]);

export const orderItemTypeEnum = pgEnum('order_item_type', [
  'purchase',
  'rental',
]);

export const paymentProviderEnum = pgEnum('payment_provider', [
  'mobilepay',
  'card',
  'dankort',
]);

export const paymentStatusEnum = pgEnum('payment_status', [
  'pending',
  'completed',
  'failed',
  'refunded',
]);

export const payoutStatusEnum = pgEnum('payout_status', [
  'pending',
  'completed',
  'rejected',
]);

export const invoiceStatusEnum = pgEnum('invoice_status', [
  'pending',
  'paid',
  'overdue',
  'cancelled',
]);

// Coupons
export const couponStatusEnum = pgEnum('coupon_status', [
  'active',
  'inactive',
  'completed',
]);

export const couponDiscountTypeEnum = pgEnum('coupon_discount_type', [
  'fixed_amount',
  'percentage',
]);

// Access Control
export const userAccessTypeEnum = pgEnum('user_access_type', [
  'purchased',
  'rented',
]);

// Analytics
export const analyticsEventTypeEnum = pgEnum('analytics_event_type', [
  'view',
  'visit',
  'click',
  'download',
  'play_start',
  'play_complete',
  'rent',
  'purchase',
]);

// Live Events
export const liveEventStatusEnum = pgEnum('live_event_status', [
  'scheduled',
  'live',
  'ended',
  'cancelled',
]);

// External Imports
export const importProviderEnum = pgEnum('import_provider', [
  'youtube',
  'vimeo',
  'dropbox',
]);

export const importStatusEnum = pgEnum('import_status', [
  'pending',
  'processing',
  'completed',
  'failed',
]);

// Notifications
export const notificationTypeEnum = pgEnum('notification_type', [
  'purchase',
  'rental',
  'payout',
  'subscription',
  'system',
]);

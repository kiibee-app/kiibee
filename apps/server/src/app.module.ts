import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { ContentModule } from './modules/content/content.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { validateAppEnv } from './validators/appEnvSchema';
import { MediaModule } from './modules/media/media.module';
import { CouponModule } from './modules/coupon/coupon.module';
import { CollectionModule } from './modules/collection/collection.module';
import { CreatorModule } from './modules/creator/creator.module';
import { FeedModule } from './modules/feed/feed.module';
import { OrderModule } from './modules/order/order.module';
import { PaymentModule } from './modules/payment/payment.module';
import { ViewerModule } from './modules/viewer/viewer.module';
import { CreatorUsersModule } from './modules/creator-users/creator-users.module';
import { ExportModule } from './modules/export/export.module';
import { CreatorOverviewModule } from './modules/creator-overview/creator-overview.module';
import { SupportModule } from './modules/support/support.module';
import { PayoutModule } from './modules/payout/payout.module';
import { NotificationSettingsModule } from './modules/notification-settings/notification-settings.module';
import { TutorialVideosModule } from './modules/tutorial-videos/tutorial-videos.module';
import { DownloadModule } from './modules/download/download.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    DiscoveryModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateAppEnv,
    }),
    ScheduleModule.forRoot(),
    HealthModule,
    AuthModule,
    ContentModule,
    SubscriptionModule,
    MediaModule,
    CouponModule,
    CollectionModule,
    CreatorModule,
    FeedModule,
    OrderModule,
    PaymentModule,
    ViewerModule,
    CreatorUsersModule,
    ExportModule,
    CreatorOverviewModule,
    SupportModule,
    PayoutModule,
    NotificationSettingsModule,
    TutorialVideosModule,
    DownloadModule,
  ],
  controllers: [AppController],
})
export class AppModule {}

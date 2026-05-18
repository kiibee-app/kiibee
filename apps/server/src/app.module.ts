import { Module } from '@nestjs/common';
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

@Module({
  imports: [
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
  ],
})
export class AppModule {}

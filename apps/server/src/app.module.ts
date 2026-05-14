import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { ContentModule } from './modules/content/content.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { validateAppEnv } from './validators/appEnvSchema';

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
  ],
})
export class AppModule {}

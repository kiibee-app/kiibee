import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import helmet from '@fastify/helmet';
import { AppModule } from './app.module';
import { pool } from './database/db';

async function bootstrap() {
  try {
    await pool.connect();
    console.log('✅ Database connected');

    const app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter({
        logger: false,
      }),
      {
        logger: false,
      },
    );

    app.setGlobalPrefix('api/v1');

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );

    app.enableCors({
      origin: true,
    });

    await app.register(helmet);

    await app.listen(3000, '0.0.0.0');

    console.log('🚀 API running at http://localhost:3000/api/v1');
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

void bootstrap();

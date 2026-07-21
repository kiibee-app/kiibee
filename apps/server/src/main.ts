import 'dotenv/config';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import helmet from '@fastify/helmet';
import multipart from '@fastify/multipart';
import { AppModule } from './app.module';
import { pool } from './database/db';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import {
  CORS_ALLOWED_HEADERS,
  CORS_HTTP_METHODS,
  FILE_SIZE_LIMIT,
  SERVER_TIMEOUT,
} from './utils/constant';
import { logger } from './logger/logger';

async function bootstrap() {
  try {
    const [app] = await Promise.all([
      NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter({
          logger: false,
          bodyLimit: FILE_SIZE_LIMIT,
          requestTimeout: SERVER_TIMEOUT.REQUEST,
          connectionTimeout: SERVER_TIMEOUT.CONNECTION,
          keepAliveTimeout: SERVER_TIMEOUT.KEEP_ALIVE,
        }),
        {
          logger: ['log', 'error', 'warn', 'debug', 'verbose'],
        },
      ),
      pool.connect().then(() => {
        console.log('✅ Database connected');
      }),
    ]);

    await app.register(multipart, {
      limits: { fileSize: FILE_SIZE_LIMIT },
    });

    app.setGlobalPrefix('api/v1', {
      exclude: ['/', 'api/v1'],
    });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        exceptionFactory: (errors) => {
          const firstError = errors[0];
          const firstMessage = firstError?.constraints
            ? Object.values(firstError.constraints)[0]
            : 'Validation failed';

          return new BadRequestException(firstMessage);
        },
      }),
    );

    app.useGlobalFilters(new HttpExceptionFilter());

    const configService = app.get(ConfigService);
    const corsOrigins = configService
      .get<string>('CORS_ORIGIN', 'http://localhost:3000')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean);

    const nodeEnv = configService.get('NODE_ENV');
    const isProduction = nodeEnv === 'production';

    app.enableCors({
      origin: (origin, callback) => {
        if (!isProduction || !origin || corsOrigins.includes(origin)) {
          callback(null, true);
          return;
        }

        logger.warn(`Blocked CORS origin: ${origin}`);
        callback(new Error('Not allowed by CORS'), false);
      },
      credentials: true,
      methods: CORS_HTTP_METHODS,
      allowedHeaders: CORS_ALLOWED_HEADERS,
      exposedHeaders: ['X-Total-Count'],
      maxAge: 3600,
    });

    await app.register(helmet);

    const port = Number(process.env.PORT) || 4001;
    await app.listen(port, '0.0.0.0');

    console.log(`🚀 API running at http://localhost:${port}/api/v1`);
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

void bootstrap();

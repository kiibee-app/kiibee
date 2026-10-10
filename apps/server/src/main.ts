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
} from './utils/constant';
import { logger } from './logger/logger';

let app: NestFastifyApplication;

async function bootstrap() {
  try {
    const fileSizeLimit =
      Number(process.env.FILE_SIZE_LIMIT || process.env.MAX_FILE_SIZE) ||
      FILE_SIZE_LIMIT;

    app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter({
        logger: false,
        bodyLimit: fileSizeLimit,
      }),
      {
        logger: ['error'],
      },
    );

    await pool.connect().then((client) => {
      logger.info('Database connected');
      client.release();
    });

    await app.register(multipart, {
      limits: { fileSize: fileSizeLimit },
    });

    const configService = app.get(ConfigService);
    const apiPrefix = configService.get<string>('API_PREFIX', 'api/v1');

    app.setGlobalPrefix(apiPrefix, {
      exclude: ['/', apiPrefix],
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

    // 100% Dynamic CORS origins & domains from ENV
    const rawCors = configService.get<string>('CORS_ORIGIN', '');
    const frontendUrl = configService.get<string>('FRONTEND_URL', '');
    const rawAllowedDomains = configService.get<string>('ALLOWED_DOMAINS', '');

    // Collect all explicit allowed origins from ENV
    const allowedOrigins = [
      ...rawCors.split(','),
      ...frontendUrl.split(','),
    ]
      .map((origin) => origin.trim().replace(/\/+$/, ''))
      .filter(Boolean);

    // Extract domain suffixes dynamically from allowedOrigins + ALLOWED_DOMAINS
    const extractedDomains = allowedOrigins.map((origin) => {
      try {
        return new URL(origin).hostname.toLowerCase();
      } catch {
        return '';
      }
    });

    const allowedDomainSuffixes = Array.from(
      new Set(
        [
          ...rawAllowedDomains.split(','),
          ...extractedDomains,
        ]
          .map((d) => d.trim().toLowerCase())
          .filter(Boolean),
      ),
    );

    const isProduction = configService.get('NODE_ENV') === 'production';

    const isAllowedOrigin = (origin?: string): boolean => {
      // Allow non-browser / server-to-server requests, or any origin in non-production
      if (!origin || !isProduction) return true;

      // Allow wildcard or exact match from CORS_ORIGIN / FRONTEND_URL
      if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        return true;
      }

      try {
        const { hostname } = new URL(origin);
        const lowerHostname = hostname.toLowerCase();

        // Localhost and loopback are always allowed
        if (lowerHostname === 'localhost' || lowerHostname === '127.0.0.1') {
          return true;
        }

        // Dynamically match any domain or subdomain configured in ENV
        return allowedDomainSuffixes.some(
          (domain) =>
            lowerHostname === domain || lowerHostname.endsWith(`.${domain}`),
        );
      } catch {
        return false;
      }
    };

    app.enableCors({
      origin: (origin, callback) => {
        if (isAllowedOrigin(origin)) {
          callback(null, true);
          return;
        }

        logger.warn(`Blocked CORS origin: ${origin}`);
        callback(null, false);
      },
      credentials: true,
      methods: CORS_HTTP_METHODS,
      allowedHeaders: CORS_ALLOWED_HEADERS,
      exposedHeaders: ['X-Total-Count'],
      maxAge: 3600,
    });

    await app.register(helmet, {
      xFrameOptions: false,
    });

    const port = Number(configService.get('PORT', 4001)) || 4001;
    const host = configService.get<string>('HOST', '0.0.0.0');
    await app.listen(port, host);

    logger.info(
      `API running at http://${host === '0.0.0.0' ? 'localhost' : host}:${port}/${apiPrefix}`,
    );
  } catch (error) {
    logger.error('Failed to start server:', error as Error);
    process.exit(1);
  }
}

void bootstrap();

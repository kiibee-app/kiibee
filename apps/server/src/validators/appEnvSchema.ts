import { z } from 'zod';
import { smtpEnvSchema } from './smtpEnvSchema';

export const appEnvSchema = smtpEnvSchema.extend({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().int().positive().default(4001),
  DATABASE_URL: z.string().trim().min(1, 'DATABASE_URL is required'),
  JWT_ACCESS_SECRET: z.string().trim().min(1, 'JWT_ACCESS_SECRET is required'),
  JWT_REFRESH_SECRET: z
    .string()
    .trim()
    .min(1, 'JWT_REFRESH_SECRET is required'),
  JWT_ACCESS_EXPIRES_IN: z
    .string()
    .trim()
    .min(1, 'JWT_ACCESS_EXPIRES_IN is required')
    .default('15m'),
  JWT_REFRESH_EXPIRES_IN: z
    .string()
    .trim()
    .min(1, 'JWT_REFRESH_EXPIRES_IN is required')
    .default('7d'),
  FRONTEND_URL: z.url('FRONTEND_URL must be a valid URL'),
  CORS_ORIGIN: z.string().trim().min(1).default('http://localhost:3000'),
  BCRYPT_SALT_ROUNDS: z.coerce.number().int().min(4).max(31).default(12),
  SENDER_EMAIL: z.string().email('SENDER_EMAIL must be a valid email'),
  SENDER_NAME: z.string().trim().min(1, 'SENDER_NAME is required'),

  // DigitalOcean Spaces (S3-compatible)
  DO_SPACES_KEY: z.string().trim().optional(),
  DO_SPACES_SECRET: z.string().trim().optional(),
  DO_SPACES_ENDPOINT: z.string().trim().optional(),
  DO_SPACES_BUCKET: z.string().trim().optional(),
  DO_SPACES_REGION: z.string().trim().default('fra1'),
  DO_SPACES_CDN_URL: z.string().trim().optional(),

  // Cloudflare (Stream / CDN - Global API Key auth)
  CLOUDFLARE_SERVICE_TOKEN: z.string().trim().optional(),
  CLOUDFLARE_ACCOUNT_ID: z.string().trim().optional(),
  CLOUDFLARE_AUTH_EMAIL: z.string().trim().optional(),
  CLOUDFLARE_AUTH_KEY: z.string().trim().optional(),

  // Umbraco source DB (for migration only)
  UMBRACO_DB_CONNECTION_STRING: z.string().trim().optional(),
});

export type AppEnv = z.infer<typeof appEnvSchema>;

export const validateAppEnv = (config: Record<string, unknown>) => {
  const parsed = appEnvSchema.safeParse(config);

  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join(', ');
    throw new Error(`Environment validation failed: ${details}`);
  }

  return parsed.data;
};

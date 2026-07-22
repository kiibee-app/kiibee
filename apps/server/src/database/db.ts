import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import { env } from 'src/config/env';
import { ENVIRONMENT } from 'src/utils/constant';
import { logger } from 'src/logger/logger';

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl:
    env.NODE_ENV === ENVIRONMENT.PRODUCTION
      ? true
      : {
          rejectUnauthorized: false,
        },
  max: env.DB_POOL_MAX,
  min: env.DB_POOL_MIN,
  connectionTimeoutMillis: env.DB_CONNECTION_TIMEOUT,
  idleTimeoutMillis: env.DB_IDLE_TIMEOUT,
  keepAlive: true,
  keepAliveInitialDelayMillis: env.DB_KEEP_ALIVE_INITIAL_DELAY,
});

pool.on('error', (err) => {
  logger.error('Database pool error:', err);
});

export async function closeDatabase() {
  try {
    logger.info('Closing database connections...');
    await pool.end();
    logger.info('Database connections closed');
  } catch (error) {
    logger.error('Error closing database connections:', error);
  }
}

export const db = drizzle(pool, { schema });

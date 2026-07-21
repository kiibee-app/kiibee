import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import { env } from 'src/config/env';
import { ENVIRONMENT } from 'src/utils/constant';

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl:
    env.NODE_ENV === ENVIRONMENT.PRODUCTION
      ? true
      : {
          rejectUnauthorized: false,
        },
});

export const db = drizzle(pool, { schema });

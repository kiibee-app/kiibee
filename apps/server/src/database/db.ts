import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import { env } from 'src/config/env';

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  statement_timeout: 15000,
  query_timeout: 15000,
});

export const db = drizzle(pool, { schema });

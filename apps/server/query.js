import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  const result = await pool.query('SELECT * FROM creator_channels');
  console.log(result.rows);
  await pool.end();
}

main().catch(console.error);

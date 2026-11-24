import 'dotenv/config';
import { Client } from 'pg';

// Additive migration; historical payouts remain unchanged.
const statements = [
  'ALTER TABLE creator_payout_requests ADD COLUMN IF NOT EXISTS fee_breakdown jsonb',
];
async function main() {
  if (!process.argv.includes('--apply')) {
    console.log(
      statements.join(';\n') +
        ';\nRun with --apply to apply this additive migration.',
    );
    return;
  }
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? true : false,
  });
  await client.connect();
  try {
    await client.query('BEGIN');
    for (const statement of statements) await client.query(statement);
    await client.query('COMMIT');
    console.log('Payout fee breakdown column is ready.');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    await client.end();
  }
}
main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});

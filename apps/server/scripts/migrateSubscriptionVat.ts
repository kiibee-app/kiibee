import 'dotenv/config';
import { Client } from 'pg';

// Additive migration. Existing DKK cuts and historical tax treatment are retained.
const statements = [
  'ALTER TABLE creator_plans ADD COLUMN IF NOT EXISTS custom_kiibee_cut_pct integer',
  'ALTER TABLE subscription_checkouts ADD COLUMN IF NOT EXISTS subtotal_minor integer',
  'ALTER TABLE subscription_checkouts ADD COLUMN IF NOT EXISTS vat_minor integer',
  'ALTER TABLE subscription_checkouts ADD COLUMN IF NOT EXISTS vat_rate integer',
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
    console.log(
      'Subscription VAT snapshot and percentage cut columns are ready.',
    );
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
